import { TestBed } from '@angular/core/testing';

import { ShowModalColumnConfigService } from './show-modal-column-config.service';

describe('ShowModalColumnConfigService', () => {
  let service: ShowModalColumnConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowModalColumnConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
