import { Component, Input, WritableSignal, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { totalExpenseSignal } from '../../../models/totalExpense.model';
import { ReaisPipe } from "../../../pipes/reais.pipe";

@Component({
  selector: 'app-toolbar-totals',
  standalone: true,
  templateUrl: './toolbar-totals.component.html',
  styleUrl: './toolbar-totals.component.scss',
  imports: [ToolbarModule, ButtonModule, ReaisPipe]
})
export class ToolbarTotalsComponent {
  totals: WritableSignal<totalExpenseSignal> = signal({ total: "0", paid: "0", fixed: "0" });

  setTotals(expenses: any[]) {
    const totals = Object.keys(this.totals());

    for (let index = 0; index < totals.length; index++) {
      const key = totals[index];
      let total = expenses.reduce((sum: number, product: any) => {
        if (key === "total") {
          return sum + product.value;
        } else {
          if (product[key]) {
            sum = sum + product.value;
          }
          return sum
        }
      }, 0
      );
      this.totals.update((current) => {
        current[key] = (+total).toFixed(2);
        return current
      });
    }
  }

  openModal(arg0: string) {
    throw new Error('Method not implemented.');
  }
}
