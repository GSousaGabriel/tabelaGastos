import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reais',
  standalone: true
})
export class ReaisPipe implements PipeTransform {

  transform(value: number | string, ...args: unknown[]): unknown {

    if (value) {
      value = this.checkAndParseString(value);

      const stringValue = value.toString().replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return "R$ " + stringValue;
    }
    return value
  }

  checkAndParseString(value: string | number){
      if(typeof value === "string"){
        return (+value).toFixed(2)
      }
      return value
  }
}