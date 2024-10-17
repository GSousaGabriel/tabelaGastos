import { Component, Input } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ExpenseCategoriesService } from '../../../services/expense-categories.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ExpenseTableColumnsService } from '../../../services/expense-table-columns.service';
import { FactoriedVariableArray } from '../../../interfaces/factoriedVariableArray';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [ReactiveFormsModule, DialogModule, ButtonModule],
  templateUrl: './category-management.component.html',
  styleUrl: './category-management.component.scss'
})
export class CategoryManagementComponent {

  fb = this.formBuilder.group({
    dataToAdd: ["",]
  })
  visible = false;
  managedData: FactoriedVariableArray = {
    type: "",
    validationField: "",
    dataValues: [],
    updateDataFn: () => { },
    setDataFn: () => { },
    fixFormatDataFn: () => { }
  };

  constructor(
    private categoryService: ExpenseCategoriesService,
    private expenseTableColumnsService: ExpenseTableColumnsService,
    private formBuilder: FormBuilder,
  ) { }

  setDataManager(type: string) {
    if (type != "columns") {
      this.managedData = {
        type,
        validationField: "code",
        dataValues: this.categoryService.showCategorySignal()[type],
        updateDataFn: this.categoryService.updateCategories.bind(this.categoryService),
        setDataFn: this.expenseTableColumnsService.updateColumns.bind(this.expenseTableColumnsService),
        fixFormatDataFn: this.categoryFormat
      }
    } else {
      this.managedData = {
        type,
        validationField: "field",
        dataValues: this.expenseTableColumnsService.showColumnsSignal(),
        updateDataFn: this.expenseTableColumnsService.updateColumns.bind(this.expenseTableColumnsService),
        setDataFn: this.expenseTableColumnsService.updateColumns.bind(this.expenseTableColumnsService),
        fixFormatDataFn: this.columnFormat
      }
    }
  }

  manageCategory(add = false) {
    const values = this.fb.get("dataToAdd")?.value;

    if (!values) {
      return
    }

    if (add) {
      const newValues = [];
      const newCategories = (values as string).split(",");
      const currentCategories = this.managedData.dataValues;
      const validValues = this.validateArray(newCategories, currentCategories, this.managedData.validationField);

      if (validValues.length > 0) {
        for (let index = 0; index < validValues.length; index++) {
          let code = validValues[index].toLowerCase();
          let name = this.capitalize(code);
          let fixedFormat = this.managedData.fixFormatDataFn(code, name)
          newValues.push(fixedFormat);
        }
      }
      this.managedData.updateDataFn(this.managedData.type, newValues);
    } else {
      const categoriesArray = (values as string).split(",");
      const lockedRows = this.categoryService.getDefaultCategories(this.managedData.type);
      const allCategories = this.managedData.dataValues;
      const newArray = this.deleteArrayValues(allCategories, categoriesArray, lockedRows, this.managedData.validationField);

      this.managedData.setDataFn(this.managedData.type, newArray);
    }
    this.visible = false;
    this.fb.get("dataToAdd")?.setValue("");
  }

  columnFormat(field: string, header: string) {
    return { field, header, orderActive: false, defaultValue: "" }
  }

  categoryFormat(name: string, code: string) {
    return { name, code }
  }

  validateArray(newValuesArray: string[], actualArray: any[], additionalField: string) {
    const validValues = [];

    for (let index = 0; index < newValuesArray.length; index++) {
      const valueExists = actualArray.findIndex(column => column[additionalField].toUpperCase() === newValuesArray[index].toUpperCase().trim());

      if (valueExists != -1) {
        continue
      }
      validValues.push(newValuesArray[index]);
    }
    return validValues
  }

  capitalize(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  deleteArrayValues(actualColumns: any[], columnsToDelete: string[], exceptions: string[], additionalField: string) {

    for (let index = 0; index < actualColumns.length; index++) {
      if (exceptions.includes(actualColumns[index].field)) {
        continue
      }

      for (let i = 0; i < columnsToDelete.length; i++) {
        const isEqual = (actualColumns[index][additionalField] as string).toUpperCase() === columnsToDelete[i].toUpperCase();

        if (isEqual) {
          actualColumns.splice(index, 1);
          index--;
        }
      }
    }

    return actualColumns
  }
}
