// login.component.ts
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntil, first } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { AuthenticationService } from 'app/auth/service';
import { CoreConfigService } from '@core/services/config.service';
import { LoginUserDto, OtpDto, VerifyMobileDto, VerifyMobileOtpDto } from 'app/auth/service/dto/authentication-dto';
import { ObjectLocalStorage } from 'app/utils/constants';

@Component({
  selector: 'app-auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = '';
  public passwordTextType = false;
  public isReceiveOtp = false;
  public trustDevice = false;
  public uuid: string = '';

  private _unsubscribeAll: Subject<any> = new Subject();

  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {
    this._coreConfigService.config = {
      layout: {
        navbar: { hidden: true },
        menu: { hidden: true },
        footer: { hidden: true },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onFocusInput() {
    this.error = '';
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    if (!this.isReceiveOtp) {
      try {
        const resVerify = await this._authenticationService.verifyMobile({ mobile: this.f.username.value });
        if (!resVerify.status) {
          this.error = resVerify.message;
          return;
        }

        const resOtp = await this._authenticationService.sendOtp({
          mobile: this.f.username.value,
          type: resVerify.data.code
        });

        if (!resOtp.status) {
          this.error = resOtp.message;
          return;
        }

        this.isReceiveOtp = true;
        this.loginForm.controls['otp'].setValidators([Validators.required]);
        this.loginForm.controls['otp'].updateValueAndValidity();
        return;

      } catch (err) {
        this.error = err;
        return;
      }
    }
      const dataVerifyOtp: VerifyMobileOtpDto = {
      mobile: this.f.username.value,
      code: this.f.otp.value,
      ref: '',
      reg_id: '',
      imei: '',
      manufacturer: '',
      model: '',
      os: 'web',
      uuid: this.uuid
    };
    if (this.isReceiveOtp) {
      try {
        const resVerifyOtp = await this._authenticationService.verifyOtp(dataVerifyOtp);

        if (!resVerifyOtp.status) {
          this.error = resVerifyOtp.message;
          return;
        }

        localStorage.setItem('id_d', this.uuid);
        this.trustDevice = true;

        const dataLogin: LoginUserDto = {
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
        };

        this.loading = true;
        this._authenticationService.login(dataLogin).pipe(first()).subscribe(
          data => {
            if (data.two_step_verify) {
              this.trustDevice = false;
              this.isReceiveOtp = false;
              localStorage.removeItem(ObjectLocalStorage.CURRENT_USER);
              localStorage.removeItem('id_d');
              return;
            }
            localStorage.setItem(ObjectLocalStorage.CURRENT_USERNAME_LOGIN, this.f.username.value);
            this._router.navigate([this.returnUrl]);
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );

      } catch (err) {
        this.error = err;
        return;
      }
    }
  }

  onCompletedInputPassword(code: string) {
    this.loginForm.patchValue({ password: code });
  }

  onCompletedInputOtp(code: string) {
    this.loginForm.patchValue({ otp: code });
  }

  ngOnInit(): void {
    this.isReceiveOtp = false;
    this.trustDevice = false;
    this.submitted = false;
    this.error = '';
    this.uuid = localStorage.getItem("id_d") || uuidv4();

    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER) || 'null');
    const currentUsername = localStorage.getItem(ObjectLocalStorage.CURRENT_USERNAME_LOGIN) || null;

    this.loginForm = this._formBuilder.group({
      username: [currentUsername ? currentUsername : (currentUser ? currentUser.phone : '')],
      password: ['', [Validators.required, Validators.minLength(6)]],
      otp: ['']
    });

    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/telecom/new-sim';

    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
