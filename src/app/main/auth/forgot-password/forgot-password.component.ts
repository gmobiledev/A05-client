import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CoreConfigService } from '@core/services/config.service';
import { ConfirmForgotPasswordDto, ForgotPasswordDto, OtpDto, SetPasswordDto } from 'app/auth/service/dto/authentication-dto';
import { AuthenticationService } from 'app/auth/service';
import { v4 as uuidv4 } from 'uuid';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { MustMatch } from 'app/auth/helpers/must-match.validator';

@Component({
  selector: 'app-auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;

  public message;

  public isSendOtp: boolean = false;
  public isConfirmOtp: boolean = false;
  public isSetPassword: boolean = false;

  // Private
  private _unsubscribeAll: Subject<any>;
  private uuid;
  private otp;
  private keyConfirm;
  private passwordInput;
  private rPasswordInput;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private authenService: AuthenticationService,
    private alertService: SweetAlertService,
    private _coreConfigService: CoreConfigService, 
    private _formBuilder: FormBuilder
    ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  onCompletedInputOtp(code) {
    this.otp = code;  
  }

  onCompletedInputPassword(code) {
    this.passwordInput = code;
    this.forgotPasswordForm.patchValue({
      password: code
    })
  }

  onCompletedInputRePassword(code) {
    this.rPasswordInput = code;
    this.forgotPasswordForm.patchValue({
      rpassword: code
    })
  }

  /**
   * On Submit
   */
  async onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }
    
    if(!this.isConfirmOtp && !this.isSendOtp) {
      let dataForgotPassword = new ForgotPasswordDto();
      dataForgotPassword.mobile = this.forgotPasswordForm.controls['username'].value;
      let resForgotPassword;
      try {
        resForgotPassword = await this.authenService.forgotPassword(dataForgotPassword);
        if(!resForgotPassword.status) {
          this.alertService.showError(resForgotPassword.message);
          this.submitted = false;
          return;
        }
        this.submitted = false;
        this.message = resForgotPassword.message;
        this.isSendOtp = true;
        this.forgotPasswordForm.controls['otp'].setValidators([Validators.required]);
        return;
      } catch (error) {
        this.alertService.showError(error);
        return;
      }
    }
    
    if(this.isSendOtp && !this.isConfirmOtp) {
      this.uuid = uuidv4();
      let dataConfirmOtp = new ConfirmForgotPasswordDto();
      dataConfirmOtp.mobile = this.forgotPasswordForm.controls['username'].value;
      dataConfirmOtp.uuid = this.uuid;
      dataConfirmOtp.otp = this.otp;
      
      let resConfirmOtp;
      try {
        resConfirmOtp = await this.authenService.forgotPasswordConfirm(dataConfirmOtp);
        if(!resConfirmOtp.status) {
          this.alertService.showError(resConfirmOtp.message);
          this.submitted = false;
          return;
        }
        this.submitted = false;
        this.isConfirmOtp = true;
        this.forgotPasswordForm.controls['otp'].setValidators(null);
        this.forgotPasswordForm.controls['password'].setValidators([Validators.required]);
        this.forgotPasswordForm.controls['rpassword'].setValidators([Validators.required]);
        this.keyConfirm = resConfirmOtp.data.key;
        return;
      } catch (error) {
        this.alertService.showError(error);
        return;
      }
    }

    if(this.isSendOtp && this.isConfirmOtp) {
      let dataSetPassword = new SetPasswordDto();
      dataSetPassword.key = this.keyConfirm;
      dataSetPassword.password = this.passwordInput;
      dataSetPassword.rpassword = this.rPasswordInput;
      dataSetPassword.uuid = this.uuid;

      let resSetPassword;
      try {
        resSetPassword = await this.authenService.setPassword(dataSetPassword);
        if(!resSetPassword.status) {
          this.submitted = false;
          this.alertService.showError(resSetPassword.message);
          return;
        }
        this.submitted = false;
        this.isSetPassword = true;
        localStorage.clear();
      } catch (error) {
        this.alertService.showError(error)
      }
    }
    
  }

  async resendOtp() {
    let dataSendOtp = new OtpDto();
    dataSendOtp.mobile = this.forgotPasswordForm.controls['username'].value;
    dataSendOtp.type = 'LOGIN';
    let resSendOtp;
    try {
      resSendOtp = await this.authenService.sendOtp(dataSendOtp);
      if(resSendOtp && !resSendOtp.status) {
        this.alertService.showError(resSendOtp.message);
        return;
      }
    } catch (error) {
      this.alertService.showError(error);
      return;
    }
    
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      username: ['', [Validators.required]],
      otp: [''],
      uuid: [''],
      key: [''],
      password: [''],
      rpassword: [''],      
    }, { validator: MustMatch('password', 'rpassword') });

    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
