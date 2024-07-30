import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatus'})
export class ShowStatusPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == 1) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đang hoạt động</span>'
    } else if (value === 0) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Đang khóa</span>'
    }
    return html;
  }
}