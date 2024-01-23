import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ExpenseCategoriesService } from '../../../services/expense-categories.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {
  @Input() capitalize!: Function;
  @Input() deleteArrayValues!: Function;
  @Input() validateArray!: Function;
  fb = this.formBuilder.group({
    categoriesToAdd: ["",]
  })
  visible = false

  constructor(
    private categoryService: ExpenseCategoriesService,
    private formBuilder: FormBuilder,
  ) { }

  manageCategory(add = false) {
    if (add) {
      const newValues = [];
      const newCategories = (this.fb.get("categoriesToAdd")?.value as string).split(",");
      const currentCategories = this.getCategories();
      const validValues = this.validateArray(newCategories, currentCategories, "code");

      if (validValues.length > 0) {
        for (let index = 0; index < validValues.length; index++) {
          let code = validValues[index].toLowerCase();
          let name = this.capitalize(code);
          newValues.push({ name, code });
        }
      }
      this.categoryService.updateCategories(newValues);
    } else {
      const categoriesArray = (this.fb.get("categoriesToAdd")?.value as string).split(",");
      const lockedRows = this.categoryService.getDefaultCategories();
      const allCategories = this.getCategories();
      const newArray = this.deleteArrayValues(allCategories, categoriesArray, lockedRows, "code");

      this.categoryService.setCategories(newArray);
    }
    this.visible = false;
    this.fb.get("categoriesToAdd")?.setValue("");
  }

  getCategories(){
    return this.categoryService.showCategorySignal();
  }
}
