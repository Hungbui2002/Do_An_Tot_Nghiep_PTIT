import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'vndCurrencyPipe',
})
export class VndCurrencyPipePipe implements PipeTransform {
  transform(value: number): string {
    if (!value) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
