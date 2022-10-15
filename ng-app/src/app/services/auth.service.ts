import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as moment from 'moment';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ConfigService } from './config.service';

import { Keys, User, AuthPacket, HasUsers } from '../models/';

type AuthFunction = () => Promise<AuthPacket>;
type RetryFunction = (renewalWaitTimeMs: number, authFunc: AuthFunction, retryFn: RetryFunction) => void;

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private authPacket$: BehaviorSubject<AuthPacket> = new BehaviorSubject(null);
	private hasUsers: HasUsers;

	constructor(private http: HttpClient, private router: Router, private configService: ConfigService) {
		const authPacket = JSON.parse(localStorage.getItem('authPacket'));
		if (authPacket) {
			this.registerAuthPacket(authPacket);
		}
	}

	isLoggedIn() {
		const authPacket = JSON.parse(localStorage.getItem('authPacket'));
		if (!authPacket) {
			return false;
		}
		return moment().isBefore(this.getExpiration());
	}

	private setSession(authPacket: AuthPacket) {
		localStorage.setItem('authPacket', JSON.stringify(authPacket));
	}

	private getSession(): AuthPacket {
		return JSON.parse(localStorage.getItem('authPacket'));
	}

	public getUser(): User {
		return this.getSession().user;
	}

	getExpiration() {
		const authPacket = JSON.parse(localStorage.getItem('authPacket'));
		const expiresAt = JSON.parse(authPacket.expiration);
		return moment.unix(expiresAt).utc();
	}

	getAuthPacket(): AuthPacket {
		return this.authPacket$.value;
	}

	logout(): void {
		this.authPacket$.next(null);
		localStorage.removeItem('authPacket');
		this.hasUsers = null;
		this.router.navigate(['/login']);
	}

	login(pkg): Observable<AuthPacket> {
		const url = this.configService.buildApiUrl('api', 'login');
		return this.http.post<AuthPacket>(url, pkg).pipe(
			map(authPacket => {
				this.registerAuthPacket(authPacket);
				this.setSession(authPacket);
				return authPacket;
			}),
			shareReplay()
		);
	}

	register(pkg): Observable<AuthPacket> {
		const url = this.configService.buildApiUrl('api', 'register');
		return this.http.post<AuthPacket>(url, pkg).pipe(
			map(authPacket => {
				this.registerAuthPacket(authPacket);
				this.setSession(authPacket);
				return authPacket;
			}),
			shareReplay()
		);
	}

	isAdmin(): boolean {
		const authPacket: AuthPacket = this.authPacket$.getValue();
		if (authPacket && authPacket.user.role === 'admin') {
			return true;
		}
		return false;
	}

	usersRegistered(): Observable<boolean> {
		const url = this.configService.buildApiUrl('api', 'has-users');
		return this.http.get<HasUsers>(url).pipe(map((results: HasUsers) => {
			this.hasUsers = results;
			return results.hasUsers;
		}));
	}

	getHasUsers(): HasUsers {
		return this.hasUsers;
	}

	getParam(key: string, defaultVal?: any) {
		const val = this.configService.get(key);
		if (val) {
			return val;
		} else {
			return defaultVal ? defaultVal : null;
		}
	}

	authenticate(pkg?): Promise<User> {
		if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
			return this.renewJWT();
		}
		return new Promise<AuthPacket>(resolve => { });
	}

	registerAuthPacket(authPacket: AuthPacket): void {
		const renewalWaitTimeMs = this.determineRenewalWaitTimeMs();
		this.authPacket$.next(authPacket);
		this.setSession(authPacket);

		if (this.configService.getBool(Keys.JWT_RENEWAL_TIMER_ENABLED)) {
			this.startRenewalTimer(
				renewalWaitTimeMs,
				this.authenticate.bind(this),
				this.startRenewalTimer.bind(this)
			);
		} else {
			console.warn(
				`JWT renewal is disabled. JWT will expire in slightly longer than ${renewalWaitTimeMs}ms`
			);
		}
	}

	startRenewalTimer(
		renewalWaitTimeMs: number,
		authFn: AuthFunction,
		renewalFn: RetryFunction
	): void {
		const retryRenew = + this.getParam(
			Keys.JWT_RENEWAL_RETRY_DELAY_MS_KEY,
			Keys.JWT_MAX_RENEW_WAIT_TIME_MS_DEFAULT
		);
		setTimeout(() => {
			authFn().then(
				() => {
					// this will generate a new renewal timer when the new packet is
					// registered ... so do nothing
				},
				error => {
					console.error(
						`Unable to renew credentials will retry in ${retryRenew}ms`,
						error
					);
					// renewal failed, try again after waiting
					renewalFn(retryRenew, authFn, renewalFn);
				}
			);
		}, renewalWaitTimeMs);
	}

	determineRenewalWaitTimeMs(): number {
		// What percentage of the time between iat and exp to wait
		const buffer = + this.getParam(
			Keys.JWT_WAIT_BUFFER_MS_KEY,
			Keys.JWT_WAIT_BUFFER_MS_DEFAULT
		);
		// Don't wait any longer than this, no matter what
		const maxWaitTimeMs = + this.getParam(
			Keys.JWT_MAX_RENEW_WAIT_TIME_MS_KEY,
			Keys.JWT_MAX_RENEW_WAIT_TIME_MS_DEFAULT
		);
		// Don't wait any less than this, no matter what
		const minWaitTimeMs = + this.getParam(
			Keys.JWT_MIN_RENEW_WAIT_TIME_MS_KEY,
			Keys.JWT_MIN_RENEW_WAIT_TIME_MS_DEFAULT
		);
		return Math.max(
			Math.min(buffer, maxWaitTimeMs),
			minWaitTimeMs
		);
	}

	renewJWT(): Promise<AuthPacket> {
		const payload = JSON.parse(localStorage.getItem('authPacket'));
		const url = this.configService.buildApiUrl('api', 'refresh-token');

		return this.http
			.post(url, payload)
			.toPromise()
			.then(
				data => this.postAuthenticated(data, true)
			);
	}

	postAuthenticated(data: any, renew?: boolean): Promise<AuthPacket> {
		if (data.jwt) {
			this.registerAuthPacket(data);

			return new Promise<AuthPacket>(resolve =>
				setTimeout(() => resolve(null as any), 1000)
			);
		} else {
			throw new Error('Authentication did not return expected results');
		}
	}

	handleAuthRedirect(data: HttpErrorResponse): void {
		const authRedirect = '/login';
		if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
			if (data.status === 401 || data.status === 403) {
				this.router.navigate([authRedirect]);
			} else {
				this.router.navigate([authRedirect]);
				throw new Error('Authentication failed');
			}
		}
	}
}
