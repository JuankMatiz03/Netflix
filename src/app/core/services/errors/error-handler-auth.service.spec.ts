import { TestBed } from '@angular/core/testing';

import { ErrorHandlerAuthService } from './error-handler-auth.service';

describe('ErrorHandlerAuthService', () => {
  let service: ErrorHandlerAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandlerAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
