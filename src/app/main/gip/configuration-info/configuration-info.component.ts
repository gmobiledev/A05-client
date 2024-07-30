import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { GipService } from 'app/auth/service/gip.service';

@Component({
  selector: 'app-configuration-info',
  templateUrl: './configuration-info.component.html',
  styleUrls: ['./configuration-info.component.scss']
})
export class ConfigurationInfoComponent implements OnInit {
  public contentHeader: any;


  formConfirm: FormGroup;
  submitted: boolean = false;

  constructor(
    private readonly userService: UserService,
    private readonly formBuilder: FormBuilder,
    private readonly alertService: SweetAlertService,
    private gipService: GipService,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initData();
    this.contentHeader = {
      headerTitle: 'Thông tin cấu hình',
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
            name: 'Thông tin cấu hình',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmit() {
    this.submitted = true;
    let data = {
      ip: this.formConfirm.controls['ip'].value,
      password: this.formConfirm.controls['password'].value,
    }
    this.gipService.updateSettings(data).subscribe(res => {
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

      ip: [''],
      password: [''],

    })
  }

  initData() {
    this.gipService.getSettings().subscribe(res => {
      this.formConfirm.patchValue({
        ip: res.data.ip,
        password: res.data.password,
      });

    })
  }

}
