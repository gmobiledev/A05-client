import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { AuthenticationService } from 'app/auth/service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from 'app/auth/helpers/must-match.validator';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-change-password',
  templateUrl: './change-password.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ChangePasswordComponent implements OnInit {
  // public
  public contentHeader: object;
  public data: any;
  public passwordTextTypeOld = false;
  public passwordTextTypeNew = false;
  public passwordTextTypeRetype = false;
  public submitted = false;
  public formGroup: FormGroup;
  
  // private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * 
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: SweetAlertService
  ) {
    // this._unsubscribeAll = new Subject();
  }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Toggle Password Text Type Old
   */
  togglePasswordTextTypeOld() {
    this.passwordTextTypeOld = !this.passwordTextTypeOld;
  }

  /**
   * Toggle Password Text Type New
   */
  togglePasswordTextTypeNew() {
    this.passwordTextTypeNew = !this.passwordTextTypeNew;
  }

  /**
   * Toggle Password Text Type Retype
   */
  togglePasswordTextTypeRetype() {
    this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
  }

  onInputCode(type, code) {
    if(type == 'new_password') {
      this.formGroup.patchValue({
        new_password: code
      })
    }
    if(type == 'password') {
      this.formGroup.patchValue({
        password: code
      })
    }
    if(type == 'confirm_new_password') {
      this.formGroup.patchValue({
        confirm_new_password: code
      })
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    if(this.formGroup.invalid) {
      return;
    }
    const data = { new_password: this.formGroup.controls['new_password'].value, password: this.formGroup.controls['password'].value };
    this.authenticationService.changePassword(data).subscribe(res => {
      if(!res.status) {
        this.alertService.showError(res.error.message);
        return;
      }
      this.alertService.showSuccess("Đổi mật khẩu thành công");
      this.router.navigate(['/dashboard/home']);
    }, error => {
      this.alertService.showError(error);
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    
    // content header
    this.contentHeader = {
      headerTitle: 'Đổi mật khẩu',
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
            name: 'Tài khoản',
            isLink: true,
            link: '/'
          },
          {
            name: 'Đổi mật khẩu',
            isLink: false
          }
        ]
      }
    };

    this.formGroup = this.formBuilder.group({
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_new_password: ['', Validators.required],
    }, { validator: MustMatch('new_password', 'confirm_new_password') });
  }

  // /**
  //  * On destroy
  //  */
  // ngOnDestroy(): void {
  //   // Unsubscribe from all subscriptions
  //   this._unsubscribeAll.next();
  //   this._unsubscribeAll.complete();
  // }
}
