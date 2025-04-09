import { FormsModule } from '@angular/forms';
import { ShowModalColumnConfigService } from '../../services/show-modal-column-config.service';
import { Component, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { Column } from '../../interfaces/column';
import { ExpenseTableColumnsService } from '../../services/expense-table-columns.service';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-modal-column-edit',
    imports: [FormsModule, ButtonModule, DialogModule, InputSwitchModule],
    templateUrl: './modal-column-edit.component.html',
    styleUrl: './modal-column-edit.component.css'
})

export class ModalColumnEditComponent {
  visible = false;
  columns!: Column[];
  type!: string;
  header!: string;

  constructor(
    private showModalColumnConfigService: ShowModalColumnConfigService,
    private expenseTableColumnsService: ExpenseTableColumnsService
  ) {
    effect(() => {
      this.visible = this.showModalColumnConfigService.showModalColumnConfig();
      this.type = this.showModalColumnConfigService.showModalColumnConfigType();

      this.header = `Active ${this.type} option for:`
    });

    this.columns = expenseTableColumnsService.showColumnsSignal();
  }

  closeModal() {
    this.showModalColumnConfigService.canShow(false);
  }

  updateOrderingRows(index: number) {
    this.expenseTableColumnsService.updateColumnsActions(index, this.type);
  }
}
