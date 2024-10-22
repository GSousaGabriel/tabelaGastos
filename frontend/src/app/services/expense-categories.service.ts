import { Injectable, WritableSignal, signal } from '@angular/core';
import { DropdownField } from '../interfaces/dropdownField';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoriesService {
  private categorySignal: WritableSignal<{[key: string]: any[]}> = signal({
    expense: [],
    income: []
  });
  readonly showCategorySignal = this.categorySignal.asReadonly();

  constructor() {
    this.setupDefaultCategories("expense");
    this.setupDefaultCategories("income");
  }

  setCategories(type: string, newValue: DropdownField[]) {
    this.categorySignal.update(current => {
      current[type] = newValue;
      return current
    });
  }

  updateCategories(type: string, newCategories: DropdownField[]) {
    this.categorySignal.update(current => {
      current[type] = [...current[type], ...newCategories];
      return current;
    });
  }

  setupDefaultCategories(type: string) {
    const defaultCategoriesSignal: DropdownField[] = [];
    const defaultCategories = this.getDefaultCategories(type);

    for (let index = 0; index < defaultCategories.length; index++) {
      const name = defaultCategories[index][0].toUpperCase() + defaultCategories[index].slice(1);

      defaultCategoriesSignal.push({ name, code: defaultCategories[index] });
    }
    this.setCategories(type, defaultCategoriesSignal)
  }

  getDefaultCategories(type: string) {
    if (type === "expense") {
      return ["clothing", "education", "electronics", "health", "recreation", "restaurant", "services", "supermarket", "trasport", "travel"];
    } else {
      return ["Gift", "Investment", "Rewards", "Salary"]
    }
  }
}
