import { TestBed } from '@angular/core/testing';

import { ShowModalNewRowService } from './show-modal-new-row.service';

describe('ShowModalNewRowService', () => {
  let service: ShowModalNewRowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowModalNewRowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
