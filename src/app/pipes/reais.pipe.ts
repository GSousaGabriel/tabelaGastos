import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reais',
  standalone: true
})
export class ReaisPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    if (value) {
      const stringValue = value.toString().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
      return "R$ " + stringValue
    }
    return value
  }

}
