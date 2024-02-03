import { Component, WritableSignal, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { totalExpenseSignal } from '../../../models/totalExpense.model';
import { ReaisPipe } from "../../../pipes/reais.pipe";
import { DropdownModule } from 'primeng/dropdown';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoriesService } from '../../../services/expense-categories.service';
import { DropdownField } from '../../../interfaces/dropdownField';

@Component({
  selector: 'app-toolbar-totals',
  standalone: true,
  templateUrl: './toolbar-totals.component.html',
  styleUrl: './toolbar-totals.component.scss',
  imports: [ReactiveFormsModule, ToolbarModule, ButtonModule, DropdownModule, ReaisPipe]
})
export class ToolbarTotalsComponent {
  totals: WritableSignal<totalExpenseSignal> = signal({ total: "0", paid: "0", fixed: "0", category: "0" });
  categories = this.expenseCategoriesService.showCategorySignal()["expense"] as DropdownField[];
  fb = this.formBuilder.group({
    categorySelected: ["",]
  })
  expenses = input<any[]>([]);
  timeoutCalculations!: any;

  constructor(
    private formBuilder: FormBuilder,
    private expenseCategoriesService: ExpenseCategoriesService
  ) { }

  setTotals(isCategory = false) {
    if (this.timeoutCalculations) {
      clearTimeout(this.timeoutCalculations);
    }

    this.timeoutCalculations = setTimeout(() => {
      const totals = Object.keys(this.totals());
      const categoryFiltered = this.fb.get("categorySelected")?.value;

      if (!categoryFiltered && isCategory) {
        return
      }

      for (let index = 0; index < totals.length; index++) {
        const key = totals[index];
        let total = this.expenses().reduce((sum: number, product: any) => {
          if (key === "total") {
            return sum + product.value;
          } else {
            if (product[key]) {
              if (key === "category") {
                if (categoryFiltered === product[key]) {
                  sum = sum + product.value;
                }
              } else {
                sum = sum + product.value;
              }
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
    }, 200);
  }
}
