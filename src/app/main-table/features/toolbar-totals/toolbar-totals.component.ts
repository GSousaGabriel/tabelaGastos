import { Component, WritableSignal, input, signal } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';
import { totalExpenseSignal } from '../../../models/totalExpense.model';
import { ReaisPipe } from "../../../pipes/reais.pipe";
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenseCategoriesService } from '../../../services/expense-categories.service';
import { DropdownField } from '../../../interfaces/dropdownField';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-toolbar-totals',
    templateUrl: './toolbar-totals.component.html',
    styleUrl: './toolbar-totals.component.css',
    imports: [ReactiveFormsModule, ProgressBarModule, SelectModule, ReaisPipe, SkeletonModule]
})
export class ToolbarTotalsComponent {
  tiles = [
    { key: 'total', label: 'Total', icon: 'pi pi-wallet', hint: 'All entries this month' },
    { key: 'paid', label: 'Paid', icon: 'pi pi-check-circle', hint: '' },
    { key: 'fixed', label: 'Fixed', icon: 'pi pi-replay', hint: 'Recurring entries' }
  ];
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

  get paidPercent(): number {
    const total = +this.totals().total;

    if (total <= 0) {
      return 0;
    }
    return Math.min(100, Math.max(0, Math.round((+this.totals().paid / total) * 100)));
  }

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
