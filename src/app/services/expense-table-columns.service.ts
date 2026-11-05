import { Injectable, WritableSignal, signal } from '@angular/core';
import { Column } from '../interfaces/column';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTableColumnsService {
  private columnsSignal: WritableSignal<Column[]> = signal(this.setupDefaultColumns());
  readonly showColumnsSignal = this.columnsSignal.asReadonly();

  constructor(private http: HttpClient) {
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

  deleteServerColumn(columnName: string): Observable<any> {
    return this.http.post(`http://localhost:8000/api/columns/`, {columnName})
  }

  getDefaultColumns() {
    return [
      { field: 'type', orderActive: false, filterActive: false, defaultValue: "expense" },
      { field: 'fixed', orderActive: false, filterActive: false, defaultValue: false },
      { field: 'paid', orderActive: false, filterActive: false, defaultValue: false },
      { field: 'installments', orderActive: false, filterActive: false, defaultValue: "1/1" },
      { field: 'category', orderActive: false, filterActive: false, defaultValue: "clothing" },
      { field: 'date', orderActive: false, filterActive: false, defaultValue: new Date() },
      { field: 'value', orderActive: false, filterActive: false, defaultValue: 0 }
    ]
  }
}
