import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Params } from '@angular/router';

import { Config } from '../models/config';
import { Keys } from '../models/keys';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

import config from '../../assets/config.json';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private localConfig: any = config;
  private environmentConfig: any = {};
  private defaultConfig: any = {};

  constructor(
    private http: HttpClient,
  ) {
    this.configureDefaults();
  }

  mapParam(key: string, params: Params) {
    if (params.hasOwnProperty(key)) {
      this.set(key, params[key]);
    }
  }

  configureDefaults(): void {
    // Configure defaults
    this.defaultConfig[Keys.RETRY_DELAY_MS_KEY] = Keys.DEFAULT_RETRY_DELAY_MS;
    this.defaultConfig[Keys.JWT_RENEWAL_RETRY_DELAY_MS_KEY] = Keys.JWT_RENEWAL_RETRY_DELAY_MS;
    this.defaultConfig[Keys.JWT_MAX_RENEW_WAIT_TIME_MS_KEY] = Keys.JWT_MAX_RENEW_WAIT_TIME_MS_DEFAULT;
    this.defaultConfig[Keys.JWT_MIN_RENEW_WAIT_TIME_MS_KEY] = Keys.JWT_MIN_RENEW_WAIT_TIME_MS_DEFAULT;
    this.defaultConfig[Keys.JWT_RENEWAL_TIMER_ENABLED] = Keys.TRUE;
    this.defaultConfig[Keys.PING_DEPENDENCIES_FREQUENCY_MS_KEY] = Keys.PING_DEPENDENCIES_FREQUENCY_MS_DEFAULT;
  }

  loadConfigData(): Observable<any> {
    return ajax('/assets/config.json').pipe(map(data => this.environmentConfig = data || new Config()));
  }

  /**
   * this builds the rest url that by passing in api, and a list of paths.
   * @param api this specifies which api you want
   * @param paths an array of paths but formatted as ('api', 'login')
   */
  buildApiUrl(api: string, ...paths: string[]): string {
    let base: string = null;
    switch (api) {
      case 'api':
        base = this.get('server');
        break;
      default:
        throw new Error(`Unrecognized API server key {api}.`);
    }
    if (base) {
      if (!base.endsWith('/')) {
        base = base + '/';
      }
    }
    return base += paths.join('/');
  }

  /**
   * @param key the value or null if not found
   */
  get(key: string): string {
    if (localStorage.getItem(key)) {
      return localStorage.getItem(key);
    } else if (this.localConfig.hasOwnProperty(key)) {
      return this.localConfig[key];
    } else if (this.environmentConfig.hasOwnProperty(key)) {
      return this.environmentConfig[key];
    } else if (this.defaultConfig.hasOwnProperty(key)) {
      return this.defaultConfig[key];
    }
    return null;
  }

  getBool(key: string): boolean {
    if (localStorage.getItem(key)) {
      return !!(JSON.parse(localStorage.getItem(key)));
    } else if (this.localConfig.hasOwnProperty(key)) {
      return !!(JSON.parse(this.localConfig[key]));
    } else if (this.environmentConfig.hasOwnProperty(key)) {
      return !!(JSON.parse(this.environmentConfig[key]));
    } else if (this.defaultConfig.hasOwnProperty(key)) {
      return !!(JSON.parse(this.defaultConfig[key]));
    }

    return false;
  }

  set(key: string, value: string) {
    this.localConfig[key] = value;
  }
}
