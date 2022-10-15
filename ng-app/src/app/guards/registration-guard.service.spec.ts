import { TestBed } from '@angular/core/testing';

import { RegistrationGuardService } from './registration-guard.service';

describe('RegistrationGuardService', () => {
  let service: RegistrationGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistrationGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
