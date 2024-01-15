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
import { FormArray, FormBuilder, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

interface City {
  name: string;
  code: string;
}

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [ReactiveFormsModule, ModalColumnEditComponent, TableModule, ButtonModule, InputTextModule, CheckboxModule, DropdownModule, InputSwitchModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss',
  providers: [FormBuilder]
})
export class MainTableComponent {
  products: WritableSignal<any> = signal([])
  timeoutItem!: any;
  periodOptions: City[] | undefined = [];
  newCols = '';
  fb = this.formBuilder.group({
    isPaid: this.formBuilder.array([])
  })

  constructor(
    private mainTableService: MainTableService,
    protected showModalNewRowService: ShowModalNewRowService,
    protected expenseTableRowsService: ExpenseTableRowsService,
    private formBuilder: FormBuilder
  ) { }

  get isPaid() {
    return this.fb.controls["isPaid"] as FormArray;
  }

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

    
    this.expenseTableRowsService.showColsSignal().forEach(linha => this.criarEnderecoFormGroup(linha.orderActive))
  }


  criarEnderecoFormGroup(paid: boolean) {
    this.isPaid.push(this.formBuilder.group({
      isPaid: [paid]
    }))
  }

  updateRow(index: number, updatedValue: string | boolean | any, column: string) {
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

  updateTableData(newRow: boolean, data: any) {
    this.products.update(newValue => {
      let updatedValues = [];

      if (newRow) {
        updatedValues = [...newValue, this.getBlankRow()]
      } else {
        updatedValues = newValue
        updatedValues[data.index][data.column] = data.updatedValue
      }
      return updatedValues
    })
  }

  getBlankRow() {
    const cols = this.expenseTableRowsService.showColsSignal();
    const newRow: { [key: string]: string } = {};

    for (let index = 0; index < cols.length; index++) {
      const field = cols[index].field;
      newRow[field] = "";
    }

    return newRow
  }

  addCols(colsToAdd: string | null | undefined) {
    if (colsToAdd) {
      const newCols = this.formatNewCols(colsToAdd);

      this.expenseTableRowsService.updateColumns(newCols);
    }
  }

  formatNewCols(colsToFormat: string): Column[] {
    const cols = colsToFormat.split(",");
    const formattedCols = [];

    for (let index = 0; index < cols.length; index++) {
      let field = cols[index].toLowerCase();
      let header = this.capitalizeFirstLetter(field)
      formattedCols.push({ field, header, orderActive: false })
    }

    return formattedCols
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
