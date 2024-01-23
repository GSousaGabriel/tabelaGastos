import { Injectable, WritableSignal, signal } from '@angular/core';
import { Column } from '../interfaces/column';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTableRowsService {
  private colsSignal: WritableSignal<Column[]> = signal(this.setupDefaultCategories());
  readonly showColsSignal = this.colsSignal.asReadonly();

  constructor() {
  }

  setColumns(newValue: Column[]) {
    this.colsSignal.set(newValue);
  }

  updateColumns(newColumns: Column[]) {
    this.colsSignal.update(newValue => [...newValue, ...newColumns])
  }

  updateColumnsOrdering(index: number) {
    this.colsSignal.update(initialValue => {
      initialValue[index].orderActive = !initialValue[index].orderActive
      return initialValue
    })
  }

  setupDefaultCategories() {
    const defaultRowsSignal = [];
    const defaultRows = this.getDefaultRows();

    for (let index = 0; index < defaultRows.length; index++) {
      const header = defaultRows[index].field[0].toUpperCase() + defaultRows[index].field.slice(1);

      defaultRowsSignal.push({ field: defaultRows[index].field, header, orderActive: false });
    }
    return defaultRowsSignal;
  }

  getDefaultRows() {
    return [
      { field: 'fixed', header: 'Fixed', orderActive: false },
      { field: 'paid', header: 'Paid', orderActive: false },
      { field: 'recurrence', header: 'Recurrence', orderActive: false },
      { field: 'category', header: 'Category', orderActive: false },
      { field: 'value', header: 'Value', orderActive: false },
      { field: 'code', header: 'Code', orderActive: false },
      { field: 'name', header: 'Name', orderActive: false },
      { field: 'quantity', header: 'Quantity', orderActive: false }
    ]
  }
}
