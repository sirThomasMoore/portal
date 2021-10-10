import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-navigation',
	templateUrl: './navigation.component.html',
	styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit, AfterViewInit {
	selected: string = '';

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit(): void {
		this.router.events.subscribe(() => {
			this.updateSelected();
		});
	}

	ngAfterViewInit(): void {}

	isAdmin(): boolean {
		return this.authService.isAdmin();
	}

	isLoggedIn(): boolean {
		return this.authService.isLoggedIn();
	}

	updateSelected(): void {
		this.selected = window.location.pathname;
	}

}
