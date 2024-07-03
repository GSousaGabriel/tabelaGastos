import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowModalManagementService {
  private showModalNewRowSignal = signal(false);
  readonly showModalNewRow = this.showModalNewRowSignal.asReadonly();
  private showModalChartSignal = signal(false);
  readonly showModalChart = this.showModalChartSignal.asReadonly();

  constructor() {
  }

  canShowNewRow(newValue: boolean) {
    this.showModalNewRowSignal.set(newValue);
  }

  canShowChart(newValue: boolean) {
    this.showModalChartSignal.set(newValue);
  }
}
