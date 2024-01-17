import { Injectable, signal } from '@angular/core';
import { Category } from '../interfaces/category';

@Injectable({
  providedIn: 'root'
})
export class ExpenseCategoriesService {
  private categorySignal = signal(this.setupDefaultCategories());
  readonly showCategorySignal = this.categorySignal.asReadonly();

  constructor() {
  }

  setCategories(newValue: Category[]) {
    this.categorySignal.set(newValue);
  }

  updateCategories(newCategories: Category[]) {
    this.categorySignal.update(newValue => [...newValue, ...newCategories])
  }

  setupDefaultCategories(){
    const defaultCategoriesSignal = []
    const defaultCategories = this.getDefaultCategories()

    for (let index = 0; index < defaultCategories.length; index++) {
      const name = defaultCategories[0].toUpperCase() + defaultCategories.slice(1)
      
      defaultCategoriesSignal.push({ name, code: defaultCategories[index] })
    }
    return defaultCategoriesSignal
  }

  getDefaultCategories(){
    return  [ "clothing", "education", "electronics", "health", "recreation", "restaurant", "services", "supermarket", "trasport", "travel"]
  }
}
