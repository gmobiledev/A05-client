import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginUserDto, OtpDto, VerifyMobileDto, VerifyMobileOtpDto } from 'app/auth/service/dto/authentication-dto';
import { ObjectLocalStorage } from 'app/utils/constants';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType: boolean;
  public isReceiveOtp: boolean = false;
  public trustDevice: boolean = false;
  public uuid: string = "";

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    // if (this._authenticationService.currentUserValue) {
    //   this._router.navigate(['/']);
    // }

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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onFocusInput() {
    this.error = '';
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      this.submitted = false;
      return;
    }
    if (!this.trustDevice && !this.isReceiveOtp) {
      let data: VerifyMobileDto = {
        mobile: this.f.username.value
      }

      let resVerify;
      let dataOtp: OtpDto;
      let resOtp;


      try {
        resVerify = await this._authenticationService.verifyMobile(data);
        if (!resVerify.status) {
          this.error = resVerify.message;
          return;
        }
        if (resVerify.data.type == 1)
          this.trustDevice = true

      } catch (error) {
        this.error = error;
        return;
      }
      this.error = '';

      dataOtp = {
        mobile: this.f.username.value,
        type: resVerify.data.code
      }
      try {
        resOtp = await this._authenticationService.sendOtp(dataOtp);
        if (!resOtp.status) {
          this.error = resOtp.message;
          return;
        }
        this.isReceiveOtp = true;
        this.loginForm.controls['otp'].setValidators([Validators.required]);
        return;

      } catch (error) {
        this.error = error;
        return;
      }

      this.error = '';
    }

    if (this.isReceiveOtp && !this.trustDevice) {
      let resVerifyOtp;
      let dataVerifyOtp: VerifyMobileOtpDto = {
        mobile: this.f.username.value,
        code: this.f.otp.value,
        ref: '',
        reg_id: '',
        imei: '',
        manufacturer: '',
        model: '',
        os: 'web',
        uuid: this.uuid
      }
      try {
        resVerifyOtp = await this._authenticationService.verifyOtp(dataVerifyOtp);
        if (!resVerifyOtp.status) {
          this.error = resVerifyOtp.message;
          return;
        }
        this.loginForm.controls['otp'].setValidators(null);
      } catch (error) {
        this.error = error;
        return;
      }

      this.loginForm.controls['password'].setValidators([Validators.required]);
      this.error = '';
      localStorage.setItem("id_d", this.uuid);
      this.trustDevice = true;
      return;
    }

    if (this.trustDevice) {
      if (this.loginForm.invalid) {
        return;
      }

      let dataLogin: LoginUserDto = {
        mobile: this.f.username.value,
        password: this.f.password.value,
        reg_id: '',
        os: 'web',
        imei: '',
        manufacturer: '',
        model: '',
        uuid: this.uuid,
        version: '',
        app_version: 10
      }

      // Login
      this.loading = true;
      this._authenticationService
        .login(dataLogin)
        .pipe(first())
        .subscribe(
          data => {
            console.log('===data===');
            console.log(data);
            if (data.two_step_verify && data.two_step_verify != undefined) {
              this.trustDevice = false;
              this.isReceiveOtp = false;
              localStorage.removeItem(ObjectLocalStorage.CURRENT_USER)
              localStorage.removeItem("id_d");
              return;
            }
            localStorage.setItem(ObjectLocalStorage.CURRENT_USERNAME_LOGIN, this.f.username.value);
            this._router.navigate([this.returnUrl]);
          },
          error => {
            console.log(error);
            this.error = error;
            this.loading = false;
          }
        );
    }
  }

  onCompletedInputPassword(code) {
    this.loginForm.patchValue({
      password: code
    })
  }

  onCompletedInputOtp(code) {
    this.loginForm.patchValue({
      otp: code
    })
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER) || null);
    this.uuid = localStorage.getItem("id_d") ? localStorage.getItem("id_d") : uuidv4();
    const currentUsername = localStorage.getItem(ObjectLocalStorage.CURRENT_USERNAME_LOGIN) ? localStorage.getItem(ObjectLocalStorage.CURRENT_USERNAME_LOGIN) : null;
    console.log(currentUsername);
    this.trustDevice = localStorage.getItem("id_d") ? true : false;
    this.loginForm = this._formBuilder.group({
      username: [currentUsername ? currentUsername : (currentUser ? currentUser.phone : '')],
      password: [''],
      otp: ['']
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';

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
