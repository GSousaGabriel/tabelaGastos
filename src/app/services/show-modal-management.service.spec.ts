import { TestBed } from '@angular/core/testing';

import { ShowModalManagementService } from './show-modal-management.service';

describe('ShowModalManagementService', () => {
  let service: ShowModalManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowModalManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
