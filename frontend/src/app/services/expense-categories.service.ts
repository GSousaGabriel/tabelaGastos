import { Injectable, WritableSignal, signal } from '@angular/core';
import { DropdownField } from '../interfaces/dropdownField';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoriesService {
  private categorySignal: WritableSignal<{ [key: string]: any[] }> = signal({
    expense: [],
    income: []
  });
  readonly showCategorySignal = this.categorySignal.asReadonly();

  constructor() {
    this.setupDefaultCategories("expense");
    this.setupDefaultCategories("income");
  }

  setCategories(newValue: DropdownField[], type: string) {
    this.categorySignal.update(current => {
      current[type] = newValue;
      return current
    });
  }

  updateCategories(newCategories: DropdownField[], type: string) {
    this.categorySignal.update(current => {
      current[type] = [...current[type], ...newCategories];
      return current;
    });
  }

  setupDefaultCategories(type: string) {
    const defaultCategoriesSignal: DropdownField[] = [];
    const defaultCategories = this.getDefaultCategories(type);

    for (let index = 0; index < defaultCategories.length; index++) {
      const name = this.setupCategoryName(defaultCategories[index]);

      defaultCategoriesSignal.push({ name, code: defaultCategories[index] });
    }
    this.setCategories(defaultCategoriesSignal, type)
  }

  setCustomCategories(data: any) {
    const defaultExpenses = [...this.getDefaultCategories("expense"), ...this.getDefaultCategories("income")];
    const newExpenses = [];
    const newIncomes = [];

    for (const item of data) {
      if (!defaultExpenses.includes(item.category)) {
        const newCategory = { name: this.setupCategoryName(item.category), code: item.category }
        if(item.type === "expense"){
          newExpenses.push(newCategory)
        }else{
        newIncomes.push(newCategory)
      }
      }
    }
    this.updateCategories(newExpenses, "expense");
    this.updateCategories(newIncomes, "income");
  }

  getDefaultCategories(type: string) {
    if (type === "expense") {
      return ["clothing", "education", "electronics", "health", "recreation", "restaurant", "services", "supermarket", "trasport", "travel"];
    } else {
      return ["Gift", "Investment", "Rewards", "Salary"]
    }
  }

  private setupCategoryName(name: string){
    return name[0].toUpperCase() + name.slice(1);
  }
}
