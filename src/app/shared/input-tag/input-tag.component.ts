import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { find, get, pull } from 'lodash';

@Component({
  selector: 'app-input-tag',
  templateUrl: './input-tag.component.html',
  styleUrls: ['./input-tag.component.scss']
})
export class InputTagComponent implements OnInit {

  @ViewChild('tagInput') tagInputRef: ElementRef;
  tags = [];
  form: FormGroup;
  @Input() input_mobile = false;
  lastInput = null;
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      tag: [undefined],
    });
  }

  focusTagInput(): void {
    this.tagInputRef.nativeElement.focus();
  }

  onKeyUp(event): void {
    if(this.input_mobile) {
      event.target.value = event.target.value.replace(/[^0-9]/g, '').replace(/(\..*?)\..*/g, '$1');
    }
    const inputValue: string = this.form.controls.tag.value;
    if (event.code === 'Backspace' && !this.lastInput) {
      this.removeTag();
      return;
    } else {
      if (event.code === 'Comma' || event.code === 'Space' || (this.input_mobile && (inputValue.length == 10 || inputValue.length == 11 )) ) {
        this.addTag(inputValue);
        this.form.controls.tag.setValue('');
      }
    }
    this.lastInput = event.target.value;
  }

  addTag(tag: string): void {
    this.lastInput = null;
    if (tag[tag.length - 1] === ',' || tag[tag.length - 1] === ' ') {
      tag = tag.slice(0, -1);
    }
    if (tag.length > 0 && !find(this.tags, tag)) {
      this.tags.push(tag);
    }
  }

  removeTag(tag?: string): void {
    this.lastInput = null;
    if (!!tag) {
      pull(this.tags, tag);
    } else {
      this.tags.splice(-1);
    }
  }

}
