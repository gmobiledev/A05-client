import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { TelecomServivce, UserService } from 'app/auth/service';
import { mobilePhoneValidator } from 'app/shared/custom-validator';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import Swal from 'sweetalert2';
// import { disableAuth } from "./tra-cuu.function.js"

@Component({
  selector: 'app-tra-cuu',
  templateUrl: './tra-cuu.component.html',
  styleUrls: ['./tra-cuu.component.scss'],
})
export class TraCuuComponent implements OnInit {
  public coreConfig: any;
  formGroup: any;
  formGroupTiket: any;
  errorInputMsisdn: string;
  submitted: boolean = false
  msisdnValid: boolean = true
  showLookUp: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly telecomService: TelecomServivce,
    private readonly userService: UserService,
    private readonly alertService: SweetAlertService,
    private titleService: Title
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout

  }

  ngOnInit(): void {
    const now = Math.round(new Date().getTime() / 1000);
    console.log(now);
    const timeExpiryStamp = 1727672400;
    if (now > timeExpiryStamp) {
      this.showLookUp = false;

    } else {
      this.showLookUp = true;
      this.titleService.setTitle("Gmobile - Tra cứu thông tin thuê bao 2G")
      this.initFormGroupTiket()
      this._coreConfigService.config = {
        layout: {
          type: "horizontal",
          animation: 'none',
          navbar: {
            hidden: false
          },
          menu: {
            hidden: true
          },
          footer: {
            hidden: false,
            scrollTop: true
          },
          customizer: false,
          enableLocalStorage: false
        }
      };
    }
  }

  ngAfterViewInit() {
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

  initForm() {
    this.formGroup = this.formBuilder.group({
      msisdn: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), mobilePhoneValidator()]],
      captcha: ['', [Validators.required]]
    })
  }
  initFormGroupTiket() {
    this.formGroupTiket = this.formBuilder.group({
      mobile: ["", [Validators.required, Validators.maxLength(10), Validators.minLength(10), mobilePhoneValidator()]],
      contact_mobile: ['', [Validators.required, mobilePhoneValidator()]],
      full_name: ['', [Validators.required, Validators.maxLength(150)]],
      identification_no: ['', [Validators.required, Validators.maxLength(15), Validators.pattern('^[a-zA-Z0-9_.-]*$')]],
      note: ['', [Validators.required, Validators.maxLength(1000)]],
      captcha: ['', [Validators.required]]
    })
  }

  get f() {
    return this.formGroup.controls;
  }
  get fTicket() {
    return this.formGroupTiket.controls
  }

  checkMobileGmobile() {
    if (this.formGroupTiket.controls['mobile'].value.length < 10) {
      this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059";
    }
    const list = ['0993', '0994', '0995', '0996', '0997', '0592', '0593', '0599', '0598']
    if (!list.includes(this.formGroupTiket.controls['mobile'].value.substring(0, 4))) {
      this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059";
    }
  }

  onFoucsInputMsisdn() {
    this.errorInputMsisdn = '';
  }
  public addTokenLog(message: string, token: string | null) {
    console.log(message, token)
    this.formGroupTiket.patchValue({ captcha: token })
    // this.log.push(`${message}: ${this.formatToken(token)}`);
  }

  submit() {
    console.log(this.formGroup)
    if (this.formGroup && this.formGroup.invalid) {
      this.submitted = true;
      return;
    }
    if (this.errorInputMsisdn && this.errorInputMsisdn.length > 0) {
      this.submitted = true;
      return;
    }
    this.telecomService.publicLookup2G(this.formGroup.value).subscribe(res => {
      // this.sectionBlockUI.stop();
      if (!res.status) {
        this.alertService.showError(res.message, 160000);
        return;
      } else if (!res.data) {
        this.alertService.showError("Không tìm thấy thông tin trùng khớp", 160000);
        return;
      } else {
        this.alertService.showMess(res.data.message, 160000)
        this.msisdnValid = true;
        this.initFormGroupTiket()
      }
    }, err => {
      // this.sectionBlockUI.stop();
      this.alertService.showError(err, 160000);
    })
  }

  submitTiket() {
    console.log(this.formGroupTiket)
    this.submitted = true;
    if (this.formGroupTiket && this.formGroupTiket.invalid) {
      return;
    }
    if (this.errorInputMsisdn.length > 0) {
      return;
    }

    this.telecomService.publicLookup2G(this.formGroupTiket.value).subscribe(res => {
      // this.sectionBlockUI.stop();
      if (!res.status) {
        Swal.fire({
          title: 'Thông báo',
          text: res.message,
          icon: 'warning',
          timer: 12000,
          customClass: {
            confirmButton: 'btn btn-primary',
          },

        }).then(function (result) {
          if (result.value) {
            // window.location.href = "https://gmobile.vn"
          }
        });
        return;
      } else if (!res.data) {
        Swal.fire({
          title: 'Thông báo',
          text: "Hệ thồng bận xin hãy thử lại sau",
          icon: 'warning',
          timer: 12000,
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          onClose: () => {
            // window.location.href = "https://gmobile.vn"
          }
        }).then(function (result) {
          if (result.value) {
            // window.location.href = "https://gmobile.vn"
          }
        });
        return;
      } else {
        Swal.fire({
          title: 'Bạn đã gửi yêu cầu thành công',
          text: res.message,
          icon: 'success',
          confirmButtonColor: '#7367F0',
          confirmButtonText: 'Xem hướng dẫn',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
          onClose: () => {
            // window.location.href = "https://gmobile.vn"
          }
        }).then(function (result) {
          if (result.value) {
            window.location.href = res.data.url
          }
        });
      }
    }, err => {
      // this.sectionBlockUI.stop();
      this.alertService.showError(err, 160000);
    })
    this.formGroupTiket.reset()
    this.submitted = false

  }

}
