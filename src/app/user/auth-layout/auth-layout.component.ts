import { Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html'
})
export class AuthLayoutComponent {
  heading = input.required<string>();
  subheading = input.required<string>();

  features = [
    { icon: 'pi pi-calendar', text: 'Review your income and expenses month by month' },
    { icon: 'pi pi-check-circle', text: 'Track what is paid, what is fixed, and your installments' },
    { icon: 'pi pi-sliders-h', text: 'Shape the table with your own columns and categories' }
  ];
}
