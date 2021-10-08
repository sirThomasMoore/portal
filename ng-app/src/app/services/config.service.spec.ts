import { TestBed } from '@angular/core/testing';
import { Config } from '../models/config';
import { Keys } from '../models/keys';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ConfigService } from './config.service';

const expectedServerConfig: Config = {
  apiUrl: 'api/',
  auth: 'auth/',
  refreshBatchQueryInterval: '30000',
  refreshInterval: '60000',
  server: 'localhost:8080/',
};

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return expected server config (HttpClient called once)', done => {
    // jest.fn().mockImplementation(() => of(expectedServerConfig));
    service.loadConfigData().subscribe(serverConfig => {
      expect(serverConfig).toEqual(expectedServerConfig);
      done();
    });
  });

  it('should have get / set functions', () => {
    service.set('foo', 'bar');
    expect(service.get('foo')).toEqual('bar');
  });

  it('should configure defaults', () => {
    service.configureDefaults();
    expect(service.get(Keys.RETRY_DELAY_MS_KEY)).toEqual(
      Keys.DEFAULT_RETRY_DELAY_MS
    );
  });

  it('should build proper api urls', done => {
    service.loadConfigData().subscribe(serverConfig => {
      const authUrl = service.buildApiUrl('auth', 'foo', 'abcde-f');
      const apiUrl = service.buildApiUrl('api', 'foo', 'abcde-f');
      expect(authUrl).toBe('auth/foo/abcde-f');
      expect(apiUrl).toBe('localhost:8080/foo/abcde-f');
      done();
    });
  });

  it('should throw an error on unlisted url', done => {
    service.loadConfigData().subscribe(serverConfig => {
      try {
        service.buildApiUrl('i-have-spoken');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      done();
    });
  });

  it('should return refreshInterval when getRefreshInterval is called', done => {
    service.loadConfigData().subscribe(serverConfig => {
      const refreshInterval = service.getRefreshInterval();
      expect(refreshInterval).toEqual('60000');
      done();
    });
  });


  it('should return the right url with / when buildApiUrl is called', done => {
    service.loadConfigData().subscribe(serverConfig => {
      const url = service.buildApiUrl('pisces', 'testingx');
      expect(url).toEqual('https://pisces.something.gov/testingx');
      done();
    });
  });

  it('should get the boolean value of configuration', () => {
    service.configureDefaults();

    let isJwtTimerEnabled = service.getBool(Keys.JWT_RENEWAL_TIMER_ENABLED);
    expect(typeof isJwtTimerEnabled).toEqual('boolean');

    service['environmentConfig'][Keys.JWT_RENEWAL_TIMER_ENABLED] = false;
    isJwtTimerEnabled = service.getBool(Keys.JWT_RENEWAL_TIMER_ENABLED);
    expect(typeof isJwtTimerEnabled).toEqual('boolean');

    service['localConfig'][Keys.JWT_RENEWAL_TIMER_ENABLED] = false;
    isJwtTimerEnabled = service.getBool(Keys.JWT_RENEWAL_TIMER_ENABLED);
    expect(typeof isJwtTimerEnabled).toEqual('boolean');

    localStorage.setItem(Keys.JWT_RENEWAL_TIMER_ENABLED, 'false');
    isJwtTimerEnabled = service.getBool(Keys.JWT_RENEWAL_TIMER_ENABLED);
    expect(typeof isJwtTimerEnabled).toEqual('boolean');

  });

  it('should get localStorage value', () => {
    localStorage.setItem('testConfigSetting', 'true');
    const getResult = service.get('testConfigSetting');
    expect(getResult).toBeTruthy();
  });

  it('should get and getBool with null or false when parameters are incorrect', () => {
    const getResult = service.get('fakeConfigSetting');
    const getBoolResult = service.getBool('fakeConfigSetting');
    expect(getResult).toBe(null);
    expect(getBoolResult).toBe(false);
  });
});
