import { FormsModule } from '@angular/forms';
import { ShowModalNewRowService } from './../../services/show-modal-new-row.service';
import { Component, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Column } from '../../interfaces/column';
import { ExpenseTableRowsService } from '../../services/expense-table-rows.service';
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
    private showModalNewRowService: ShowModalNewRowService,
    private expenseTableRowsService: ExpenseTableRowsService
  ) {
    effect(() => {
      this.visible = this.showModalNewRowService.showModalNewRow()
    });

    this.columns = expenseTableRowsService.showColsSignal()
  }

  closeModal() {
    this.showModalNewRowService.canShow(false)
  }

  updateOrderingRows(index: number){
    this.expenseTableRowsService.updateColumnsOrdering(index)
  }
}
