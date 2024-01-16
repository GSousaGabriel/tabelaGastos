import { ExpenseTableRowsService } from './../services/expense-table-rows.service';
import { Component, WritableSignal, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MainTableService } from './main-table.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ShowModalNewRowService } from '../services/show-modal-new-row.service';
import { ModalColumnEditComponent } from '../features/modal-column-edit/modal-column-edit.component';
import { Column } from '../interfaces/column';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { MessageService } from 'primeng/api';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ModalColumnEditComponent, TableModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule, InputSwitchModule, ToolbarModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
  providers: [MessageService]
})
export class MainTableComponent {
  products: WritableSignal<any> = signal([])
  timeoutItem!: any;
  periodOptions: City[] | undefined = [];
  fb = this.formBuilder.group({
    newCols: [[],]
  })
  selectedProducts!: any;

  constructor(
    private mainTableService: MainTableService,
    protected showModalNewRowService: ShowModalNewRowService,
    protected expenseTableRowsService: ExpenseTableRowsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService
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
        { field: 'code', header: 'Code', orderActive: false },
        { field: 'name', header: 'Name', orderActive: false },
        { field: 'category', header: 'Category', orderActive: false },
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
      } else if (data.column === "recurrence") {
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

  addCols(colsToAdd: string | null | undefined) {
    if (colsToAdd) {
      const newCols = this.formatNewCols(colsToAdd);
      this.expenseTableRowsService.updateColumns(newCols);
    }
  }

  deleteColumns(colsToDelete: string | null | undefined) {
    if (colsToDelete) {
      const columnsArray = colsToDelete.split(",");
      this.expenseTableRowsService.deleteColumns(columnsArray);
    }
  }


  formatNewCols(colsToFormat: string): Column[] {
    const cols = this.columnsAlreadyAdded(colsToFormat)
    const formattedCols = [];

    if (cols.length > 0) {
      for (let index = 0; index < cols.length; index++) {
        let field = cols[index].toLowerCase();
        let header = this.capitalizeFirstLetter(field)
        formattedCols.push({ field, header, orderActive: false })
      }
    }
    return formattedCols
  }

  columnsAlreadyAdded(colsToValidate: string) {
    const columns = colsToValidate.split(",")
    const allColumns = this.expenseTableRowsService.showColsSignal();
    let validColumns = [];

    for (let index = 0; index < columns.length; index++) {
      const columnExists = allColumns.findIndex(column => column.field.toUpperCase() === columns[index].toUpperCase())

      if (columnExists != -1) {
        continue
      }
      validColumns.push(columns[index])
    }
    return validColumns
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
