import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public contentHeader: any;


  formConfirm: FormGroup;
  submitted: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly alertService: SweetAlertService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initData();
    this.contentHeader = {
      headerTitle: 'Thông tin cá nhân',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Thông tin cá nhân',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmit() {
    this.submitted = true;
    let data = {
      name: this.formConfirm.controls['name'].value,
      identification_no: this.formConfirm.controls['identification_no'].value,
      gender: this.formConfirm.controls['gender'].value,
      email: this.formConfirm.controls['email'].value,
    }
    if(this.formConfirm.controls['birth'].value) {
      const birth = this.formConfirm.controls['birth'].value.year +  '-' +
      (this.formConfirm.controls['birth'].value.month > 10 ? this.formConfirm.controls['birth'].value.month : '0' + this.formConfirm.controls['birth'].value.month) + '-' +
      (this.formConfirm.controls['birth'].value.day > 10 ? this.formConfirm.controls['birth'].value.day : '0' + this.formConfirm.controls['birth'].value.day);
      data['birth'] = Math.floor( (new Date(birth)).getTime() / 1000);
    }
    if(this.formConfirm.controls['identification_date'].value) {
      const identification_date = this.formConfirm.controls['identification_date'].value.year +  '-' +
      (this.formConfirm.controls['identification_date'].value.month > 10 ? this.formConfirm.controls['identification_date'].value.month : '0' + this.formConfirm.controls['identification_date'].value.month) + '-' +
      (this.formConfirm.controls['identification_date'].value.day > 10 ? this.formConfirm.controls['identification_date'].value.day : '0' + this.formConfirm.controls['identification_date'].value.day);
      data['identification_date'] = Math.floor( (new Date(identification_date)).getTime() / 1000);
    }
    this.userService.updateUserInfo(data).subscribe(res => {
      this.submitted = false;
      if(!res.status) {
        this.alertService.showMess(res.message);
      }
      this.alertService.showSuccess(res.message);
    }, error => {
      this.submitted = false;
      this.alertService.showMess(error);
    })
  }

  onDateSelection(date: NgbDate) {
  }

  get f() {
    return this.formConfirm.controls;
  }

  initForm() {
    this.formConfirm = this.formBuilder.group({
      name: ['', Validators.required],
      birth: [''],
      gender: [''],
      email: ['', Validators.required],
      identification_no: ['', Validators.required],
      identification_date: ['']
    })
  }

  initData() {
    this.userService.getUserInfo().subscribe(res => {
      this.formConfirm.patchValue({
        name: res.data.info.name,
        gender: res.data.info.gender,
        identification_no: res.data.info.identification_no,
        
      });
      if(res.data.info.birth) {
        const arrBirth = new Date(res.data.info.birth*1000).toISOString().slice(0,10).split('-');
        this.formConfirm.patchValue({
          birth: new NgbDate(
            parseInt(arrBirth[2]),
            parseInt(arrBirth[1]),
            parseInt(arrBirth[0])
          )
        })
      }

      if(res.data.info.identification_date) {
        const arrIdentificationDate = new Date(res.data.info.identification_date*1000).toISOString().slice(0,10).split('-');
        this.formConfirm.patchValue({
          identification_date: new NgbDate(
            parseInt(arrIdentificationDate[2]),
            parseInt(arrIdentificationDate[1]),
            parseInt(arrIdentificationDate[0])
          )
        })
      }
    })
  }

}
