import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './user.service';

describe('UserService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
