import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'statusFile'})
export class StatusFile implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == 1) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đã ký</span>'
    } else if (value ===2) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chưa ký</span>'
    }
    return html;
  }
}