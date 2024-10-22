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

  setColumns(type: string, newValue: Column[]) {
    this.columnsSignal.set(newValue);
  }

  updateColumns(type: string, newColumns: Column[]) {
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
      const field = defaultColumns[index].field;
      const orderActive = defaultColumns[index].orderActive;
      const defaultValue = defaultColumns[index].defaultValue;

      defaultColumnsSignal.push({ field, header, orderActive, defaultValue });
    }
    return defaultColumnsSignal;
  }

  getDefaultColumns() {
    return [
      { field: 'id', orderActive: false, defaultValue: 0 },
      { field: 'type', orderActive: false, defaultValue: "expense" },
      { field: 'fixed', orderActive: false, defaultValue: "" },
      { field: 'paid', orderActive: false, defaultValue: "" },
      { field: 'recurrence', orderActive: false, defaultValue: "" },
      { field: 'category', orderActive: false, defaultValue: "" },
      { field: 'date', orderActive: false, defaultValue: "" },
      { field: 'value', orderActive: false, defaultValue: "" }
    ]
  }
}
