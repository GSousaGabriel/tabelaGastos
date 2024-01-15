import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowModalNewRowService {
  private showModalNewRowSignal = signal(false);

  readonly showModalNewRow = this.showModalNewRowSignal.asReadonly();

  constructor() {
  }

  canShow(newValue: boolean) {
    this.showModalNewRowSignal.set(newValue);
  }
}
