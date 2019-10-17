import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'genderPipe' })

export class GenderPipe implements PipeTransform {
      transform(value): string {
            if (value === 'M' || value === 'male') {
                  return '男';
            } else if (value === 'F' || value === 'female') {
                  return '女';
            } else if (value === 'O') {
                  return '未知';
            } else {
                  return '';
            }
      }
}
