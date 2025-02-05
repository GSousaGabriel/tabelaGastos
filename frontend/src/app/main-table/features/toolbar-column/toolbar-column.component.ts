import { Component, Input, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { ShowModalColumnConfigService } from '../../../services/show-modal-column-config.service';
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
        this.openModal('order');
      }
    },
    {
      label: 'Columns to filter',
      command: () => {
        this.openModal('filter');
      }
    }
  ]

  constructor(
    private formBuilder: FormBuilder,
    private showModalColumnConfigService: ShowModalColumnConfigService
  ) { }

  openModal(type: string) {
    this.showModalColumnConfigService.canShow(true);
    this.showModalColumnConfigService.setType(type);
  }
}
