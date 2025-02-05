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

  manageColumns(columns: string[], _ = "") {
    const defaultColumns = this.getDefaultColumns();
    const defaultColumnsFields = defaultColumns.map(defaultColumn => defaultColumn.field);
    const newColumns = [];

    for (const column of columns) {
      if (!defaultColumnsFields.includes(column) && column != "_id") {
        newColumns.push(
          { field: column, header: column[0].toUpperCase() + column.slice(1), orderActive: false, filterActive: false, defaultValue: "" }
        )
      }
    }
    this.updateColumns(newColumns);
  }

  setColumns(newColumns: Column[], _ = "") {
    this.columnsSignal.set(newColumns)
  }

  updateColumns(newColumns: Column[], _ = "") {
    this.columnsSignal.update(newValue => [...newValue, ...newColumns])
  }

  updateColumnsActions(index: number, type: string) {
    let action!: string;

    if (type === "order") {
      action = "orderActive"
    } else {
      action = "filterActive"
    }

    this.columnsSignal.update(initialValue => {
      initialValue[index][action] = !initialValue[index][action]
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
      const filterActive = defaultColumns[index].filterActive;
      const defaultValue = defaultColumns[index].defaultValue;

      defaultColumnsSignal.push({ field, header, orderActive, filterActive, defaultValue });
    }
    return defaultColumnsSignal;
  }

  getDefaultColumns() {
    return [
      { field: 'type', orderActive: false, filterActive: false, defaultValue: "expense" },
      { field: 'fixed', orderActive: false, filterActive: false, defaultValue: "" },
      { field: 'paid', orderActive: false, filterActive: false, defaultValue: "" },
      { field: 'recurrence', orderActive: false, filterActive: false, defaultValue: "" },
      { field: 'category', orderActive: false, filterActive: false, defaultValue: "" },
      { field: 'date', orderActive: false, filterActive: false, defaultValue: new Date() },
      { field: 'value', orderActive: false, filterActive: false, defaultValue: "" }
    ]
  }
}
