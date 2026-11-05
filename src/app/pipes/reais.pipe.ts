import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reais',
  standalone: true
})
export class ReaisPipe implements PipeTransform {

  transform(value: number | string, ...args: unknown[]): unknown {
    const amount = Number(value);

    if (value === null || value === undefined || value === "" || Number.isNaN(amount)) {
      return value;
    }

    const stringValue = amount.toFixed(2).replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return "R$ " + stringValue;
  }
}
