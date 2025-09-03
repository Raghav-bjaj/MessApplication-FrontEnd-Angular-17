
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskRegNo',
  standalone: true,
})
export class MaskRegNoPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value || value.length < 5) {
      return ''; // Return empty for invalid input
    }
    const start = value.substring(0, 3);
    const end = value.substring(value.length - 2);
    return `${start}*****${end}`;
  }
}

