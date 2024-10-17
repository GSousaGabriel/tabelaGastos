import { Component, Input, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ShowModalNewRowService } from '../../../services/show-modal-new-row.service';
import { SplitButtonModule } from 'primeng/splitbutton';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CategoryManagementComponent } from '../category-management/category-management.component';

@Component({
  selector: 'app-toolbar-column',
  standalone: true,
  imports: [ReactiveFormsModule, ToolbarModule, ButtonModule, InputTextModule, CategoryManagementComponent, SplitButtonModule],
  templateUrl: './toolbar-column.component.html',
  styleUrl: './toolbar-column.component.scss'
})
export class ToolbarColumnComponent {
  @ViewChild(CategoryManagementComponent) categoryManagementComponent!: CategoryManagementComponent;
  fb = this.formBuilder.group({
    newColumns: ["",]
  });
  items = [
    {
      label: 'Columns to order',
      command: () => {
        this.openModal('columnsOptions');
      }
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private showModalNewRowService: ShowModalNewRowService
  ) { }

  openModal(type: string) {
    if (type === "columnsOptions") this.showModalNewRowService.canShow(true);
  }
}
