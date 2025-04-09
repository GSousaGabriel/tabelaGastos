import { Component, WritableSignal, input, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SkeletonModule } from 'primeng/skeleton';
import { totalExpenseSignal } from '../../../models/totalExpense.model';
import { ReaisPipe } from "../../../pipes/reais.pipe";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoriesService } from '../../../services/expense-categories.service';
import { DropdownField } from '../../../interfaces/dropdownField';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-toolbar-totals',
    templateUrl: './toolbar-totals.component.html',
    styleUrl: './toolbar-totals.component.css',
    imports: [ReactiveFormsModule, ToolbarModule, ButtonModule, SelectModule, ReaisPipe, SkeletonModule, FloatLabelModule]
})
export class ToolbarTotalsComponent {
  totals: WritableSignal<totalExpenseSignal> = signal({ total: "0", paid: "0", fixed: "0", category: "0" });
  categories = this.expenseCategoriesService.showCategorySignal()["expense"] as DropdownField[];
  fb = this.formBuilder.group({
    categorySelected: [undefined,]
  })
  expenses = input<any[]>([]);
  timeoutCalculations!: ReturnType<typeof setTimeout>;
  loadingTotals = false;

  constructor(
    private formBuilder: FormBuilder,
    private expenseCategoriesService: ExpenseCategoriesService
  ) { }

  setTotals(isCategory = false) {
    this.loadingTotals = true

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
      this.loadingTotals = false
    }, 200);
  }
}
