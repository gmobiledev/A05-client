import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showIconMno'})
export class ShowIconMnoPipe implements PipeTransform {
  transform(value: string): string {
    let html = '';
    if(value) {
        html = '<img class="img-icon-mno"  src="/assets/images/icons/'+value+'.webp">'
    } else if (value == 'VMS') {
        html = '<img class="img-icon-mno"  src="/assets/images/icons/'+value+'.webp">'
    }  else if (value == 'GSIM') {
      html = '<img class="img-icon-mno"  src="/assets/images/logo/logo.png">'
  } 
    return html;
  }
}