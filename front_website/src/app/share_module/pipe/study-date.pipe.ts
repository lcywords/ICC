import { Pipe, PipeTransform } from '@angular/core';

@Pipe(
    {
        name: 'studyDate'
    }
)

export class StudyDate implements PipeTransform {
    transform(value: string) {
        if (value.length < 6) {
            return value;
        }
        return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6)}`;
    }
}

