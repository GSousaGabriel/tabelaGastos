import { Component, Input, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ShowModalNewRowService } from '../../../services/show-modal-new-row.service';
import { ExpenseTableColumnsService } from '../../../services/expense-table-columns.service';
import { Column } from '../../../interfaces/column';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoryManagementComponent } from '../category-management/category-management.component';

@Component({
  selector: 'app-toolbar-column',
  standalone: true,
  imports: [ReactiveFormsModule, ToolbarModule, ButtonModule, InputTextModule, CategoryManagementComponent],
  templateUrl: './toolbar-column.component.html',
  styleUrl: './toolbar-column.component.scss'
})
export class ToolbarColumnComponent {
  @ViewChild(CategoryManagementComponent) categoryManagementComponent!: CategoryManagementComponent;
  fb = this.formBuilder.group({
    newColumns: ["",]
  });

  constructor(
    private formBuilder: FormBuilder,
    private showModalNewRowService: ShowModalNewRowService,
    private expenseTableColumnsService: ExpenseTableColumnsService
  ) { }

  addColumns() {
    const newColumns = this.fb.get("newColumns")?.value

    // if (newColumns) {
    //   const newCols = this.formatNewColumns(newColumns);
    //   this.expenseTableColumnsService.updateColumns(newCols);
    // }
  }

  deleteColumns() {
    const newColumns = this.fb.get("newColumns")?.value

    if (newColumns) {
      const columnsArray = newColumns.split(",");
      const lockedColumns = this.expenseTableColumnsService.getDefaultColumns().map(column=>column.field);
      const allColumns = this.expenseTableColumnsService.showColumnsSignal();
      //const newArray = this.deleteArrayValues(allColumns, columnsArray, lockedColumns, "field");

      //this.expenseTableColumnsService.setColumns(newArray)
    }
  }

  // formatNewColumns(columnsToFormat: string): Column[] {
  //   const allColumns = this.expenseTableColumnsService.showColumnsSignal();
  //   const columnsArray = columnsToFormat.split(",");
  //   const cols = this.validateArray(columnsArray, allColumns, "field");
  //   const formattedCols = [];

  //   if (cols.length > 0) {
  //     for (let index = 0; index < cols.length; index++) {
  //       let field = cols[index].toLowerCase();
  //       let header = this.capitalize(field);
  //       formattedCols.push({ field, header, orderActive: false, defaultValue: "" });
  //     }
  //   }
  //   return formattedCols;
  // }

  openModal(type: string) {
    if (type === "columnsOptions") this.showModalNewRowService.canShow(true);
  }
}
