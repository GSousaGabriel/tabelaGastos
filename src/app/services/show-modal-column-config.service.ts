import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShowModalColumnConfigService {
  private showModalColumnConfigSignal = signal(false);
  readonly showModalColumnConfig = this.showModalColumnConfigSignal.asReadonly();
  private showModalColumnConfigTypeSignal = signal("");
  readonly showModalColumnConfigType = this.showModalColumnConfigTypeSignal.asReadonly();

  constructor() {
  }

  canShow(newValue: boolean) {
    this.showModalColumnConfigSignal.set(newValue);
  }

  setType(newValue: string) {
    this.showModalColumnConfigTypeSignal.set(newValue);
  }
}
