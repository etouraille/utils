import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cent'
})
export class CentPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    return value / 100;
  }

}
