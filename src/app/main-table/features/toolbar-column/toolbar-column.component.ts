import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ShowModalNewRowService } from '../../../services/show-modal-new-row.service';
import { ExpenseTableRowsService } from '../../../services/expense-table-rows.service';
import { Column } from '../../../interfaces/column';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar-column',
  standalone: true,
  imports: [ReactiveFormsModule, ToolbarModule, ButtonModule, InputTextModule],
  templateUrl: './toolbar-column.component.html',
  styleUrl: './toolbar-column.component.scss'
})
export class ToolbarColumnComponent {
  @Input() capitalize!: Function;
  @Input() deleteArrayValues!: Function;
  @Input() validateArray!: Function;
  fb = this.formBuilder.group({
    newColumns: ["",]
  })

  constructor(
    private formBuilder: FormBuilder,
    private showModalNewRowService: ShowModalNewRowService,
    private expenseTableRowsService: ExpenseTableRowsService
  ) { }

  addColumns() {
    const newColumns = this.fb.get("newColumns")?.value

    if (newColumns) {
      const newCols = this.formatNewColumns(newColumns);
      this.expenseTableRowsService.updateColumns(newCols);
    }
  }

  deleteColumns() {
    const newColumns = this.fb.get("newColumns")?.value

    if (newColumns) {
      const columnsArray = newColumns.split(",");
      const lockedRows = ["fixed", "paid", "recurrence", "category", "value"]
      const allColumns = this.expenseTableRowsService.showColsSignal();
      const newArray = this.deleteArrayValues(allColumns, columnsArray, lockedRows, "field");

      this.expenseTableRowsService.setColumns(newArray)
    }
  }

  formatNewColumns(columnsToFormat: string): Column[] {
    const allColumns = this.expenseTableRowsService.showColsSignal();
    const columnsArray = columnsToFormat.split(",");
    const cols = this.validateArray(columnsArray, allColumns, "field");
    const formattedCols = [];

    if (cols.length > 0) {
      for (let index = 0; index < cols.length; index++) {
        let field = cols[index].toLowerCase();
        let header = this.capitalize(field);
        formattedCols.push({ field, header, orderActive: false });
      }
    }
    return formattedCols;
  }

  openModal(type: string) {
    if (type === "columnsOptions") this.showModalNewRowService.canShow(true)
  }
}
