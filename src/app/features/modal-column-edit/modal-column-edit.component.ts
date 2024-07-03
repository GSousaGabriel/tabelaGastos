import { FormsModule } from '@angular/forms';
import { ShowModalManagementService } from '../../services/show-modal-management.service';
import { Component, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Column } from '../../interfaces/column';
import { ExpenseTableColumnsService } from '../../services/expense-table-columns.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-modal-column-edit',
  standalone: true,
  imports: [FormsModule, ButtonModule, DialogModule, InputSwitchModule],
  templateUrl: './modal-column-edit.component.html',
  styleUrl: './modal-column-edit.component.scss'
})

export class ModalColumnEditComponent {
  visible = false;
  columns!: Column[];

  constructor(
    private showModalNewRowService: ShowModalManagementService,
    private expenseTableColumnsService: ExpenseTableColumnsService
  ) {
    effect(() => {
      this.visible = this.showModalNewRowService.showModalNewRow();
    });

    const allColumns = expenseTableColumnsService.showColumnsSignal();
    allColumns.shift();
    this.columns = allColumns;
  }

  closeModal() {
    this.showModalNewRowService.canShowNewRow(false);
  }

  updateOrderingRows(index: number) {
    this.expenseTableColumnsService.updateColumnsOrdering(index);
  }
}
