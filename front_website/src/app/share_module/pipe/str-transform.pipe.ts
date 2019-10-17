import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'strTransformPipe' })

export class StrTransformPipe implements PipeTransform {
      transform(value, exponent): string {
            let numberStr = value.match(/\d+/g).join('');
            console.log('pipe', numberStr);
            if (!numberStr) {
                  return '';
            } else if (numberStr.length < 8) {
                  while (numberStr.length < 8) {
                        numberStr += '0';
                  }
            }
            switch (exponent) {
                  case 'YY-MM-DD':
                        return numberStr.substr(0, 4) + '-' + numberStr.substr(0, 2) + '-' + numberStr.substr(0, 2);
                  case 'YY/MM/DD':
                        return numberStr.substr(0, 4) + '/' + numberStr.substr(0, 2) + '/' + numberStr.substr(0, 2);
                  case 'YYMMDD':
                        return numberStr.substr(0, 8);
                  default:
                        return numberStr.substr(0, 4) + '-' + numberStr.substr(0, 2) + '-' + numberStr.substr(0, 2);
            }
      }
}
