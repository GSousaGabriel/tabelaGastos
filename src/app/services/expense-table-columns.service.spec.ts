import { TestBed } from '@angular/core/testing';

import { ExpenseTableColumnsService } from './expense-table-columns.service';

describe('ExpenseTableRowsService', () => {
  let service: ExpenseTableColumnsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpenseTableColumnsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
