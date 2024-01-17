import { Injectable, WritableSignal, signal } from '@angular/core';
import { Column } from '../interfaces/column';

@Injectable({
  providedIn: 'root'
})
export class ExpenseTableRowsService {
  private colsSignal: WritableSignal<Column[]> = signal([]);
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
}
