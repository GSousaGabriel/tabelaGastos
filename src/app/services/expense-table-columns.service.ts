import { Injectable, WritableSignal, signal } from '@angular/core';
import { Column } from '../interfaces/column';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTableColumnsService {
  private columnsSignal: WritableSignal<Column[]> = signal(this.setupDefaultColumns());
  readonly showColumnsSignal = this.columnsSignal.asReadonly();

  constructor() {
  }

  setColumns(newValue: Column[]) {
    this.columnsSignal.set(newValue);
  }

  updateColumns(newColumns: Column[]) {
    this.columnsSignal.update(newValue => [...newValue, ...newColumns])
  }

  updateColumnsOrdering(index: number) {
    this.columnsSignal.update(initialValue => {
      initialValue[index].orderActive = !initialValue[index].orderActive
      return initialValue
    })
  }

  setupDefaultColumns() {
    const defaultColumnsSignal = [];
    const defaultColumns = this.getDefaultColumns();

    for (let index = 0; index < defaultColumns.length; index++) {
      const header = defaultColumns[index].field[0].toUpperCase() + defaultColumns[index].field.slice(1);

      defaultColumnsSignal.push({ field: defaultColumns[index].field, header, orderActive: false });
    }
    return defaultColumnsSignal;
  }

  getDefaultColumns() {
    return [
      { field: 'type', header: 'Type', orderActive: false },
      { field: 'fixed', header: 'Fixed', orderActive: false },
      { field: 'paid', header: 'Paid', orderActive: false },
      { field: 'recurrence', header: 'Recurrence', orderActive: false },
      { field: 'category', header: 'Category', orderActive: false },
      { field: 'value', header: 'Value', orderActive: false }
    ]
  }
}
