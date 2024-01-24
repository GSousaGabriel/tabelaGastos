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
import { DialogModule } from 'primeng/dialog';
import { ShowModalNewRowService } from '../services/show-modal-new-row.service';
import { ModalColumnEditComponent } from '../features/modal-column-edit/modal-column-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarColumnComponent } from './features/toolbar-column/toolbar-column.component';
import { ToolbarTotalsComponent } from './features/toolbar-totals/toolbar-totals.component';
import { CategoryManagementComponent } from './features/category-management/category-management.component';
import { DropdownField } from '../interfaces/dropdownField';

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [ModalColumnEditComponent, ToolbarColumnComponent, ToolbarTotalsComponent, CategoryManagementComponent, FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule, InputSwitchModule, InputNumberModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
  providers: [MessageService]
})
export class MainTableComponent {
  @ViewChild(ToolbarTotalsComponent) toolbarTotalsComponent!: ToolbarTotalsComponent;
  @ViewChild(CategoryManagementComponent) categoryManagementComponent!: CategoryManagementComponent;

  products: WritableSignal<any> = signal([]);
  categoryOptions: WritableSignal<DropdownField[]> = signal([]);
  types = [
    { code: "expense", name: "Expense" },
    { code: "income", name: "Income" }
  ]
  timeoutItem!: any;
  periodOptions: DropdownField[] = [];
  categories: any[] = [];
  selectedProducts!: any;

  constructor(
    private mainTableService: MainTableService,
    protected showModalNewRowService: ShowModalNewRowService,
    protected expenseTableColumnsService: ExpenseTableColumnsService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.mainTableService.getProductsMini().then((data: any) => {
      this.products.set(data);
      this.updateTableData(true, null);

      for (let index = 0; index < 24; index++) {
        const fixedValue = (index + 1);
        this.periodOptions?.push({ name: fixedValue, code: fixedValue });
      }
      this.toolbarTotalsComponent.setTotals(this.products());
      this.categories = this.categoryManagementComponent.getCategories() as any[];
    });
  }

  updateRow(index: number, updatedValue: string | boolean, column: string) {
    if (this.timeoutItem) {
      clearTimeout(this.timeoutItem);
    }

    this.timeoutItem = setTimeout(() => {
      this.updateTableData(false, { index, updatedValue, column });
      this.toolbarTotalsComponent.setTotals(this.products());
    }, 200);

    this.addRow(index);
  }

  addRow(index: number) {
    const lastIndex = this.products().length - 1;

    if (index === lastIndex) {
      this.updateTableData(true, null);
    }
  }

  deleteSelectedProducts() {
    this.updateTableData(false, null, true);
    this.selectedProducts = null;
    this.toolbarTotalsComponent.setTotals(this.products());
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

  }

  updateTableData(newRow: boolean, data: any, deleteRow = false) {
    this.products.update(newValue => {
      let updatedValues: any[] = [];

      if (deleteRow) {
        updatedValues = newValue.filter((val: any) => !this.selectedProducts?.includes(val));
      } else if (newRow) {
        updatedValues = [...newValue, this.getBlankRow()]
      } else {
        updatedValues = newValue;
        updatedValues[data.index][data.column] = data.updatedValue;
      }
      return updatedValues
    })
  }

  getBlankRow() {
    const cols = this.expenseTableColumnsService.showColumnsSignal();
    const newRow: { [key: string]: string | { name: string, code: string } } = {};

    for (let index = 0; index < cols.length; index++) {
      const field = cols[index].field;
      newRow[field] = "";

      if (field === "recurrence") {
        newRow[field] = { name: "1", code: '1' };
      }
    }

    return newRow
  }

  deleteArrayValues(actualColumns: any[], columnsToDelete: string[], exceptions: string[], additionalField: string) {

    for (let index = 0; index < actualColumns.length; index++) {
      if (exceptions.includes(actualColumns[index].field)) {
        continue
      }

      for (let i = 0; i < columnsToDelete.length; i++) {
        const isEqual = (actualColumns[index][additionalField] as string).toUpperCase() === columnsToDelete[i].toUpperCase();

        if (isEqual) {
          actualColumns.splice(index, 1);
          index--;
        }
      }
    }

    return actualColumns
  }

  validadeArrayUniqueValues(newValuesArray: string[], actualArray: any[], additionalField: string) {
    const validValues = [];

    for (let index = 0; index < newValuesArray.length; index++) {
      const valueExists = actualArray.findIndex(column => column[additionalField].toUpperCase() === newValuesArray[index].toUpperCase());

      if (valueExists != -1) {
        continue
      }
      validValues.push(newValuesArray[index]);
    }
    return validValues
  }

  capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  clear(table: Table) {
    table.clear();
  }
}
