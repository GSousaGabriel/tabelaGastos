import { Component, OnInit, effect } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ChartModule } from 'primeng/chart';
import { ShowModalManagementService } from '../../../../../services/show-modal-management.service';
import { ExpenseCategoriesService } from '../../../../../services/expense-categories.service';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [ButtonModule, DialogModule, ChartModule],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  visible = false;
  data!: any;
  options!: any;

  constructor(
    private showModalChartService: ShowModalManagementService,
    protected expenseCategoriesService: ExpenseCategoriesService
  ) {
    effect(() => {
      this.initializeData();
      this.visible = this.showModalChartService.showModalChart();
    });
  }

  ngOnInit(): void {
    const textColor = this.getColor('--text-color')

    this.options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: textColor
          }
        }
      }
    };
  }

  initializeData() {
    this.data = {
      labels: this.expenseCategoriesService.showCategorySignal()["expense"],
      datasets: [
        {
          data: [540, 325, 702],
          backgroundColor: [this.getColor('--blue-500'), this.getColor('--yellow-500'), this.getColor('--green-500')],
          hoverBackgroundColor: [this.getColor('--blue-400'), this.getColor('--yellow-400'), this.getColor('--green-400')]
        }
      ]
    };
  }

  getColor(color: string) {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue(color);

    return textColor
  }

  closeModal() {
    this.showModalChartService.canShowChart(false)
  }
}
