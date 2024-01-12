import { Component, WritableSignal, signal } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MainTableService } from './main-table.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-main-table',
  standalone: true,
  imports: [TableModule, ButtonModule, InputTextModule],
  templateUrl: './main-table.component.html',
  styleUrl: './main-table.component.scss'
})
export class MainTableComponent {
  products: WritableSignal<any> = signal([])
  cols: WritableSignal<Column[]> = signal([])
  timeoutItem!: any;

  constructor(private mainTableService: MainTableService) { }

  ngOnInit() {
    this.mainTableService.getProductsMini().then((data: any) => {
      this.products.set(data);
      this.updateTableData(true, null);
    });

    this.cols.set(
      [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'category', header: 'Category' },
        { field: 'quantity', header: 'Quantity' }
      ]
    )
  }

  updateRow(index: number, updatedValue: string, column: string) {
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
    const cols = this.cols();
    const newRow: { [key: string]: string } = {};

    for (let index = 0; index < cols.length; index++) {
      const field = cols[index].field;
      newRow[field] = "";
    }

    return newRow
  }

  addCols(colsToAdd: string) {
    const newCols = this.formatNewCols(colsToAdd);

    this.cols.update(newValue => [...newValue, ...newCols]);
  }

  formatNewCols(colsToFormat: string): Column[] {
    const cols = colsToFormat.split(",");
    const formattedCols = [];

    for (let index = 0; index < cols.length; index++) {
      let field = cols[index].toLowerCase();
      let header = this.capitalizeFirstLetter(field)
      formattedCols.push({ field, header })
    }

    return formattedCols
  }

  capitalizeFirstLetter(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  clear(table: Table) {
    table.clear()
  }
}
