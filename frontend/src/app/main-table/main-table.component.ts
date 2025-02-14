import { ExpenseTableColumnsService } from '../services/expense-table-columns.service';
import { Component, ViewChild, WritableSignal, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MainTableService } from './main-table.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { ShowModalColumnConfigService } from '../services/show-modal-column-config.service';
import { ModalColumnEditComponent } from '../features/modal-column-edit/modal-column-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarColumnComponent } from './features/toolbar-column/toolbar-column.component';
import { ToolbarTotalsComponent } from './features/toolbar-totals/toolbar-totals.component';
import { CategoryManagementComponent } from './features/category-management/category-management.component';
import { DropdownField } from '../interfaces/dropdownField';
import { ExpenseCategoriesService } from '../services/expense-categories.service';

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [ModalColumnEditComponent, ToolbarColumnComponent, ToolbarTotalsComponent, CategoryManagementComponent, FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule, InputSwitchModule, InputNumberModule, CalendarModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
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
  selectedExpenses!: any;
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

  deleteSelectedExpenses() {
    this.updateTableData(false, null, true);
    this.selectedExpenses = null;
    this.toolbarTotalsComponent.setTotals();
    this.addRow(-1);
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

  }

  updateTableData(newRow: boolean, data: any, deleteRow = false) {
    this.expenses.update(newValue => {
      let updatedValues: any[] = [];

      if (deleteRow) {
        updatedValues = newValue.filter((val: any) => !this.selectedExpenses?.includes(val));
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
