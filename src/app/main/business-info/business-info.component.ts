import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { format } from 'path';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.scss']
})
export class BusinessInfoComponent implements OnInit {

  public contentHeader: any;

  data: any;
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
      headerTitle: 'Thông tin doanh nghiệp',
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
            name: 'Thông tin doanh nghiệp',
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
      address: this.formConfirm.controls['address'].value,
      license_issue_place: this.formConfirm.controls['license_issue_place'].value,
      license_no: this.formConfirm.controls['license_no'].value,
    }
    if (this.formConfirm.controls['birth'].value) {
      const birth = this.formConfirm.controls['birth'].value.year + '-' +
        (this.formConfirm.controls['birth'].value.month > 10 ? this.formConfirm.controls['birth'].value.month : '0' + this.formConfirm.controls['birth'].value.month) + '-' +
        (this.formConfirm.controls['birth'].value.day > 10 ? this.formConfirm.controls['birth'].value.day : '0' + this.formConfirm.controls['birth'].value.day);
      data['birth'] = Math.floor((new Date(birth)).getTime() / 1000);
    }
    if (this.formConfirm.controls['identification_date'].value) {
      const identification_date = this.formConfirm.controls['identification_date'].value.year + '-' +
        (this.formConfirm.controls['identification_date'].value.month > 10 ? this.formConfirm.controls['identification_date'].value.month : '0' + this.formConfirm.controls['identification_date'].value.month) + '-' +
        (this.formConfirm.controls['identification_date'].value.day > 10 ? this.formConfirm.controls['identification_date'].value.day : '0' + this.formConfirm.controls['identification_date'].value.day);
      data['identification_date'] = Math.floor((new Date(identification_date)).getTime() / 1000);
    }
    if (this.formConfirm.controls['license_issue_date'].value) {
      const license_issue_date = this.formConfirm.controls['license_issue_date'].value.year + '-' +
        (this.formConfirm.controls['license_issue_date'].value.month > 10 ? this.formConfirm.controls['license_issue_date'].value.month : '0' + this.formConfirm.controls['license_issue_date'].value.month) + '-' +
        (this.formConfirm.controls['license_issue_date'].value.day > 10 ? this.formConfirm.controls['license_issue_date'].value.day : '0' + this.formConfirm.controls['license_issue_date'].value.day);
      data['license_issue_date'] = Math.floor((new Date(license_issue_date)).getTime() / 1000);
    }
    this.userService.updateUserInfo(data).subscribe(res => {
      this.submitted = false;
      if (!res.status) {
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
      identification_date: [''],
      address: [''],
      license_issue_date: [''],
      license_issue_place: [''],
      license_no: [''],
      representative_name: [''],
      representative_CCCD: [''],
      representative_address: [''],
      representative_birth: [''],
      representative_place: [''],
      representative_date: [''],

    })
  }

  initData() {
    this.userService.getUserInfo().subscribe(res => {

      this.data = res.data
    
      this.formConfirm.patchValue({
        name: res.data.organization.name,
        gender: res.data.info.gender,
        identification_no: res.data.info.identification_no,
        address: res.data.organization.address,
        license_issue_place: res.data.organization.license_issue_place,
        license_no: res.data.organization.license_no,
        license_issue_date: res.data.organization.license_issue_date,

        representative_name: res.data.organization.customer.people.name,
        representative_CCCD: res.data.organization.customer.people.identification_no,
        representative_address: res.data.organization.customer.people.address,
        representative_birth: res.data.organization.customer.people.birth,
        representative_place: res.data.organization.customer.people.identification_place,
        representative_date: res.data.organization.customer.people.identification_date,



      });
      
      if (res.data.info.birth) {
        const arrBirth = new Date(res.data.info.birth * 1000).toISOString().slice(0, 10).split('-');
        this.formConfirm.patchValue({
          birth: new NgbDate(
            parseInt(arrBirth[2]),
            parseInt(arrBirth[1]),
            parseInt(arrBirth[0])
          )
        })
      }

      // if (res.data.organization.license_issue_date) {
      //   const arrBirth = new Date(res.data.organization.license_issue_date * 1000).toISOString().slice(0, 10).split('-');
      //   this.formConfirm.patchValue({
      //     license_issue_date: new NgbDate(
      //       parseInt(arrBirth[2]),
      //       parseInt(arrBirth[1]),
      //       parseInt(arrBirth[0])
      //     )
      //   })
      // }

      if (res.data.info.identification_date) {
        const arrIdentificationDate = new Date(res.data.info.identification_date * 1000).toISOString().slice(0, 10).split('-');
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
