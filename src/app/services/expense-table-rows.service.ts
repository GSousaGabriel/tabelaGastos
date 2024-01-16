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

  deleteColumns(columnsToDelete: string[]) {
    this.colsSignal.update(newValue => {
      for (let index = 0; index < newValue.length; index++) {
        if (newValue[index].field === "paid" || newValue[index].field === "recurrence") {
          continue
        }

        for (let i = 0; i < columnsToDelete.length; i++) {
          const isEqual = newValue[index].field.toUpperCase() === columnsToDelete[i].toUpperCase()

          if (isEqual) {
            newValue.splice(index, 1)
          }
        }
      }

      return newValue
    })
  }

  updateColumnsOrdering(index: number) {
    this.colsSignal.update(initialValue => {
      initialValue[index].orderActive = !initialValue[index].orderActive
      return initialValue
    })
  }
}
