import { ExpenseTableRowsService } from './../services/expense-table-rows.service';
import { Component, WritableSignal, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MainTableService } from './main-table.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DialogModule } from 'primeng/dialog';
import { ReaisPipe } from '../pipes/reais.pipe';
import { Column } from '../interfaces/column';
import { Category } from '../interfaces/category';
import { ShowModalNewRowService } from '../services/show-modal-new-row.service';
import { ModalColumnEditComponent } from '../features/modal-column-edit/modal-column-edit.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoriesService } from '../services/expense-categories.service';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [ModalColumnEditComponent, ReaisPipe, FormsModule, ReactiveFormsModule, TableModule, DialogModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule, InputSwitchModule, ToolbarModule, InputNumberModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
  providers: [MessageService]
})
export class MainTableComponent {
  products: WritableSignal<any> = signal([]);
  categoryOptions: WritableSignal<Category[]> = signal([]);
  timeoutItem!: any;
  periodOptions: City[] | undefined = [];
  fb = this.formBuilder.group({
    newColumns: ["",],
    categoriesToAdd: ["",]
  })
  selectedProducts!: any;
  visible = false

  constructor(
    private mainTableService: MainTableService,
    protected showModalNewRowService: ShowModalNewRowService,
    protected expenseTableRowsService: ExpenseTableRowsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    protected categoryService: ExpenseCategoriesService
  ) { }

  ngOnInit() {
    this.mainTableService.getProductsMini().then((data: any) => {
      this.products.set(data);
      this.updateTableData(true, null);

      for (let index = 0; index < 24; index++) {
        const fixedValue = (index + 1).toString()
        this.periodOptions?.push({ name: fixedValue, code: fixedValue })
      }
    });

    this.expenseTableRowsService.setColumns(
      [
        { field: 'paid', header: 'Paid', orderActive: false },
        { field: 'recurrence', header: 'Recurrence', orderActive: false },
        { field: 'category', header: 'Category', orderActive: false },
        { field: 'value', header: 'Value', orderActive: false },
        { field: 'code', header: 'Code', orderActive: false },
        { field: 'name', header: 'Name', orderActive: false },
        { field: 'quantity', header: 'Quantity', orderActive: false }
      ]
    )
  }

  updateRow(index: number, updatedValue: string | boolean, column: string) {
    if (this.timeoutItem) {
      clearTimeout(this.timeoutItem)
    }

    this.timeoutItem = setTimeout(() => {
      this.updateTableData(false, { index, updatedValue, column })
    }, 200);

    this.addRow(index)
  }

  addRow(index: number) {
    const lastIndex = this.products().length - 1

    if (index === lastIndex) {
      this.updateTableData(true, null)
    }
  }

  deleteSelectedProducts() {
    this.updateTableData(false, null, true)
    this.selectedProducts = null;
    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });

  }

  updateTableData(newRow: boolean, data: any, deleteRow = false) {
    this.products.update(newValue => {
      let updatedValues: any[] = [];

      if (deleteRow) {
        updatedValues = newValue.filter((val: any) => !this.selectedProducts?.includes(val));
      } else if (newRow) {
        updatedValues = [...newValue, this.getBlankRow()]
      } else if (data.column === "recurrence" || data.column === "category") {
        updatedValues = newValue
        updatedValues[data.index][data.column].code = data.updatedValue
        updatedValues[data.index][data.column].name = data.updatedValue
      } else {
        updatedValues = newValue
        updatedValues[data.index][data.column] = data.updatedValue
      }
      return updatedValues
    })
  }

  getBlankRow() {
    const cols = this.expenseTableRowsService.showColsSignal();
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

  addColumns(colsToAdd: string | null | undefined) {
    if (colsToAdd) {
      const newCols = this.formatNewColumns(colsToAdd);
      this.expenseTableRowsService.updateColumns(newCols);
    }
  }

  deleteColumns(colsToDelete: string | null | undefined) {
    if (colsToDelete) {
      const columnsArray = colsToDelete.split(",");
      const lockedRows = ["paid", "recurrence", "value"]
      const allColumns = this.expenseTableRowsService.showColsSignal();
      const newArray = this.deleteArrayValues(allColumns, columnsArray, lockedRows, "field");

      this.expenseTableRowsService.setColumns(newArray)
    }
  }

  manageCategory(add = false) {
    if (add) {
      const newCategories = (this.fb.get("categoriesToAdd")?.value as string).split(",");
      const currentCategories = this.categoryService.showCategorySignal();
      this.validadeArrayUniqueValues(newCategories, currentCategories, "code")
      
      this.visible = false
      this.fb.get("categoriesToAdd")?.setValue("")
    }
  }

  deleteArrayValues(actualColumns: Column[], columnsToDelete: string[], exceptions: string[], additionalField: string) {

    for (let index = 0; index < actualColumns.length; index++) {
      if (exceptions.includes(actualColumns[index].field)) {
        continue
      }

      for (let i = 0; i < columnsToDelete.length; i++) {
        const isEqual = (actualColumns[index][additionalField] as string).toUpperCase() === columnsToDelete[i].toUpperCase()

        if (isEqual) {
          actualColumns.splice(index, 1)
        }
      }
    }

    return actualColumns
  }

  formatNewColumns(columnsToFormat: string): Column[] {
    const allColumns = this.expenseTableRowsService.showColsSignal();
    const columnsArray = columnsToFormat.split(",");
    const cols = this.validadeArrayUniqueValues(columnsArray, allColumns, "field");
    const formattedCols = [];

    if (cols.length > 0) {
      for (let index = 0; index < cols.length; index++) {
        let field = cols[index].toLowerCase();
        let header = this.capitalizeFirstLetter(field);
        formattedCols.push({ field, header, orderActive: false });
      }
    }
    return formattedCols;
  }

  validadeArrayUniqueValues(newValuesArray: string[], actualArray: any[], additionalField: string) {
    const validValues = [];

    for (let index = 0; index < newValuesArray.length; index++) {
      const valueExists = actualArray.findIndex(column => column[additionalField].toUpperCase() === newValuesArray[index].toUpperCase())

      if (valueExists != -1) {
        continue
      }
      validValues.push(newValuesArray[index])
    }
    return validValues
  }

  capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  clear(table: Table) {
    table.clear()
  }

  openModal(type: string) {
    if (type === "columnsOptions") this.showModalNewRowService.canShow(true)
  }
}
