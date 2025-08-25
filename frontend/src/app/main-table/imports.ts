import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { IconField } from "primeng/iconfield";
import { InputIcon } from "primeng/inputicon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { ModalColumnEditComponent } from "../features/modal-column-edit/modal-column-edit.component";
import { CategoryManagementComponent } from "./features/category-management/category-management.component";
import { ToolbarColumnComponent } from "./features/toolbar-column/toolbar-column.component";
import { ToolbarTotalsComponent } from "./features/toolbar-totals/toolbar-totals.component";
import { SelectModule } from 'primeng/select';
import { ToastModule } from "primeng/toast";

@NgModule({
    imports: [
        ModalColumnEditComponent,
        ToolbarColumnComponent,
        ToolbarTotalsComponent,
        CategoryManagementComponent,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputSwitchModule,
        InputNumberModule,
        DatePickerModule,
        InputIcon,
        IconField,
        SelectModule,
        ToastModule
    ],
    exports: [
        ModalColumnEditComponent,
        ToolbarColumnComponent,
        ToolbarTotalsComponent,
        CategoryManagementComponent,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        InputSwitchModule,
        InputNumberModule,
        DatePickerModule,
        InputIcon,
        IconField,
        SelectModule,
        ToastModule
    ],
    providers: []
})
export class ImportsModuleMainTable { }
