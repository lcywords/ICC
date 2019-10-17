import { Pipe, PipeTransform } from '@angular/core';
import { differenceInCalendarDays, differenceInYears } from 'date-fns';
@Pipe({ name: 'agePipe' })

export class AgePipe implements PipeTransform {
      transform(value, exponent): string {
            const _age = differenceInYears(exponent, value);
            if (_age || _age === 0) {
                  return (_age === 0) ? `${_age + 1}`  : `${_age}`;
            } else {
                  return '';
            }
      }
}
