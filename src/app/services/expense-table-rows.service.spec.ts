import { TestBed } from '@angular/core/testing';

import { ExpenseTableRowsService } from './expense-table-rows.service';

describe('ExpenseTableRowsService', () => {
  let service: ExpenseTableRowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseTableRowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
