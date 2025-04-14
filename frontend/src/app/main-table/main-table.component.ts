import { ExpenseTableColumnsService } from '../services/expense-table-columns.service';
import { Component, ViewChild, WritableSignal, signal } from '@angular/core';
import { Table } from 'primeng/table';
import { MainTableService } from './main-table.service';
import { MessageService } from 'primeng/api';
import { ShowModalColumnConfigService } from '../services/show-modal-column-config.service';
import { ToolbarTotalsComponent } from './features/toolbar-totals/toolbar-totals.component';
import { CategoryManagementComponent } from './features/category-management/category-management.component';
import { DropdownField } from '../interfaces/dropdownField';
import { ExpenseCategoriesService } from '../services/expense-categories.service';
import { ImportsModuleMainTable } from './imports';

@Component({
  selector: 'app-main-table',
  imports: [ImportsModuleMainTable],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.css',
  providers: [MessageService]
})
export class MainTableComponent {
  @ViewChild(ToolbarTotalsComponent) toolbarTotalsComponent!: ToolbarTotalsComponent;
  @ViewChild(CategoryManagementComponent) categoryManagementComponent!: CategoryManagementComponent;

  expenses: WritableSignal<any[]> = signal([]);
  categoryOptions: WritableSignal<DropdownField[]> = signal([]);
  types = [
    { code: "expense", name: "Expense" },
    { code: "income", name: "Income" }
  ]
  timeoutItem!: any;
  periodOptions: DropdownField[] = [];
  categories = this.categoryService.showCategorySignal();
  filterPeriod = new Date();

  constructor(
    private mainTableService: MainTableService,
    protected showModalColumnConfigService: ShowModalColumnConfigService,
    protected expenseTableColumnsService: ExpenseTableColumnsService,
    private categoryService: ExpenseCategoriesService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadTable()
  }

  loadTable() {
    this.expenses.set([])
    this.mainTableService.getFinancialData(this.filterPeriod).subscribe({
      next: (response) => {
        this.expenseTableColumnsService.manageColumns(Object.keys(response.data[0]))
        this.expenses.set(response.data);

        for (let index = 0; index < 24; index++) {
          const fixedValue = (index + 1);
          this.periodOptions?.push({ name: fixedValue, code: fixedValue });
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.statusText });
        this.addRow(-1);
      },
      complete: () => {
        this.addRow(-1);
      },
    });
  }

  updateRow(index: number, updatedValue: any, column: string) {
    this.addRow(index);
    const itemId = this.expenses()[index]["_id"]

    if (this.timeoutItem) {
      clearTimeout(this.timeoutItem);
    }

    this.timeoutItem = setTimeout(() => {
      this.updateTableData(false, { index, updatedValue, column });
      this.mainTableService.updateAddItem(itemId, column, updatedValue)
      this.toolbarTotalsComponent.setTotals();
    }, 200);

  }

  addRow(index: number) {
    const lastIndex = this.expenses().length - 1;

    if (index === -1) {
      index = lastIndex;
    }

    if (index === lastIndex) {
      this.updateTableData(true, index);
      return true;
    }
    return false;
  }

  deleteSelectedExpenses(itemId: string) {
    this.updateTableData(false, null, itemId);
    this.toolbarTotalsComponent.setTotals();

    this.mainTableService.deleteItem(itemId).subscribe({
      next: () => {
        this.addRow(-1);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
      },
      error: (err) => {
        this.addRow(-1);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err.statusText });
      }
    })
  }

  updateTableData(newRow: boolean, data: any, rowToDelete = "") {
    this.expenses.update(newValue => {
      let updatedValues: any[] = [];

      if (rowToDelete) {
        updatedValues = newValue.filter((val: any) => val["_id"] != rowToDelete);
      } else if (newRow) {
        updatedValues = [...newValue, this.getBlankRow(data)];
      } else {
        updatedValues = newValue;
        updatedValues[data.index][data.column] = data.updatedValue;
      }
      return updatedValues
    })
  }

  getBlankRow(indexRow: number) {
    const cols = this.expenseTableColumnsService.showColumnsSignal();
    const newRow: { [key: string]: number | string | Date | { name: string, code: string } } = {};

    for (let index = 0; index < cols.length; index++) {
      const field = cols[index].field;

      newRow[field] = cols[index].defaultValue;
    }

    newRow["_id"] = indexRow + 2;
    return newRow
  }

  clear(table: Table) {
    table.clear();
  }
}
