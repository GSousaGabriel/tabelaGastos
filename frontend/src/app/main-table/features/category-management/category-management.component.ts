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
    lockedRows: [],
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
        lockedRows: this.categoryService.getDefaultCategories(type),
        dataValues: this.categoryService.showCategorySignal()[type],
        updateDataFn: this.categoryService.updateCategories.bind(this.categoryService),
        setDataFn: this.categoryService.setCategories.bind(this.categoryService),
        fixFormatDataFn: this.categoryFormat
      }
    } else {
      this.managedData = {
        type,
        validationField: "field",
        lockedRows: this.expenseTableColumnsService.getDefaultColumns().map(defaultColumn => defaultColumn.field),
        dataValues: this.expenseTableColumnsService.showColumnsSignal(),
        updateDataFn: this.expenseTableColumnsService.updateColumns.bind(this.expenseTableColumnsService),
        setDataFn: this.expenseTableColumnsService.setColumns.bind(this.expenseTableColumnsService),
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
      const validValues = this.validateArray(newCategories, currentCategories);

      if (validValues.length > 0) {
        for (let index = 0; index < validValues.length; index++) {
          let name = validValues[index].toLowerCase().trim();
          let code = this.capitalize(name);
          let fixedFormat = this.managedData.fixFormatDataFn(code, name)
          newValues.push(fixedFormat);
        }
      }
      this.managedData.updateDataFn(newValues, this.managedData.type);
    } else {
      const categoriesArray = (values as string).split(",");
      const allCategories = this.managedData.dataValues;
      const newArray = this.deleteArrayValues(allCategories, categoriesArray);

      this.managedData.setDataFn(newArray, this.managedData.type);
    }
    this.visible = false;
    this.fb.get("dataToAdd")?.setValue("");
  }

  columnFormat(header: string, field: string) {
    return { field, header, orderActive: false, filterActive: false, defaultValue: "" }
  }

  categoryFormat(name: string, code: string) {
    return { name, code }
  }

  validateArray(newValuesArray: string[], actualArray: any[]) {
    const validValues = [];

    for (let index = 0; index < newValuesArray.length; index++) {
      const valueExists = actualArray.findIndex(column => column[this.managedData.validationField].toUpperCase() === newValuesArray[index].toUpperCase().trim());

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

  deleteArrayValues(actualArray: any[], valuesToDelete: string[]) {
    const actualFields = actualArray.map(actualArray => actualArray[this.managedData.validationField])

    for (let i = 0; i < valuesToDelete.length; i++) {
      const normalizedDataValue = valuesToDelete[i].toLocaleLowerCase().trim();

      if (this.managedData.lockedRows.includes(normalizedDataValue)) {
        continue
      }

      const indexToDelete = actualFields.findIndex(actualField => actualField.toLowerCase() === normalizedDataValue)

      if (indexToDelete != -1) {
        actualArray.splice(indexToDelete, 1);
        actualFields.splice(indexToDelete, 1);
      }
    }

    return actualArray
  }
}
