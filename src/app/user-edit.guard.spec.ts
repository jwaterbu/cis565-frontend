import { TestBed } from '@angular/core/testing';

import { UserEditGuard } from './user-edit.guard';

describe('UserEditGuard', () => {
  let guard: UserEditGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserEditGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
