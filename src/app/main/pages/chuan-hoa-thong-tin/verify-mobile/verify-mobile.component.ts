import { Component, OnInit,  } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TelecomServivce } from 'app/auth/service';
import { RecentCallDto, RequestOtpMobileDto, VerifyMobileDto } from 'app/auth/service/dto/standardinfo.dto';
import { mobilePhoneValidator } from 'app/shared/custom-validator';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import {Observable, of} from 'rxjs';
import {filter, map} from 'rxjs/operators';
@Component({
  selector: 'app-verify-mobile',
  templateUrl: './verify-mobile.component.html',
  styleUrls: ['./verify-mobile.component.scss']
})
export class VerifyMobileComponent implements OnInit {
  
  checkValidMobile: any;
  errorInputMsisdn: string;
  formGroup: any;
  isReceiveOtp: boolean = false;
  isConfirmOtp: boolean = false;
  currentTaskUpdateInfo: any;
  resultRequestOtp: any;
  timeLeftOtp  = 2*60;
  intervalOtp;

  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService
    ) {
  }
   
  async onNextStep(){

    if(!this.isReceiveOtp) {
      if(!this.formGroup.controls['msisdn'].value) {
        this.alertService.showMess("Vui lòng nhập SĐT");
        return;
      }
      let dataRequestOtp = new RequestOtpMobileDto();
      dataRequestOtp.msisdn = this.formGroup.controls['msisdn'].value;
      if(this.currentTaskUpdateInfo) {
        dataRequestOtp.task_id = this.currentTaskUpdateInfo.id;
        dataRequestOtp.request_id = this.currentTaskUpdateInfo.request_id;
      }
      
      try {
        this.timeLeftOtp = 120;
        this.resultRequestOtp = await this.telecomService.standardInfoRequestOtp(dataRequestOtp).toPromise();
        if(!this.resultRequestOtp.status) {
          this.alertService.showError(this.resultRequestOtp.message);
        }
        localStorage.setItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO, JSON.stringify(this.resultRequestOtp.data));
        this.currentTaskUpdateInfo = this.resultRequestOtp.data;
        this.isReceiveOtp = true;
        this.startTimer();
        return;
      } catch (error) {
        this.alertService.showError(error);
      }
    }
    if(this.isReceiveOtp && !this.isConfirmOtp) {
      if(!this.formGroup.controls['otp'].value) {
        this.alertService.showMess("Vui lòng nhập mã OTP");
        return;
      }
      let dataVerifyMobile = new VerifyMobileDto();
        dataVerifyMobile.otp = this.formGroup.controls['otp'].value;
        dataVerifyMobile.request_id = this.currentTaskUpdateInfo.request_id;
        dataVerifyMobile.task_id = this.currentTaskUpdateInfo.id;
        let resultVerifyMobile;
        try {
          resultVerifyMobile = await this.telecomService.standardInfoVerifyMobile(dataVerifyMobile).toPromise();
          if (!resultVerifyMobile.status) {
            this.alertService.showError(resultVerifyMobile.message);
          }
          this.isConfirmOtp = true;
          return;
        } catch (error) {
          this.alertService.showError(error);
        }            
    }    
    if(this.isConfirmOtp) {
      if(this.formGroup.invalid) {
        return;
      }
      let arrayDialedNumbers = [];
      for(let i = 0;i<5;i++) {
        if(this.formGroup.controls['dialed_numbers_'+ (i+1)].value) {
          arrayDialedNumbers.push(this.formGroup.controls['dialed_numbers_'+ (i+1)].value)
        }
      }
      console.log(arrayDialedNumbers);
      if( !arrayDialedNumbers || arrayDialedNumbers.length < 1) {
        this.alertService.showMess("Vui lòng nhập 5 số liên hệ gần đây");
        return;
      }
      const duplicateM = arrayDialedNumbers.filter((item, index) => arrayDialedNumbers.indexOf(item) !== index);
      if(duplicateM.length > 0) {
        this.alertService.showMess("Dữ liệu nhập bị trùng " + duplicateM.join(","));
        return;
      }
      let dataRecentCall = new RecentCallDto();
      let continueStep = false;
      if(!this.resultRequestOtp.data.first_time_request) {
        if ((await this.alertService.showConfirm(this.resultRequestOtp.message, "", "Tiếp tục", "Bỏ qua")).value) {
          continueStep = true;
        } else {
          localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO);
          location.reload();
        }
      } else {
        continueStep = true;
      }
      
      if (continueStep) {
        dataRecentCall.first_time_request = this.resultRequestOtp.data.first_time_request;
        dataRecentCall.request_id = this.currentTaskUpdateInfo.request_id;
        dataRecentCall.task_id = this.currentTaskUpdateInfo.id;
        dataRecentCall.dialed_numbers = arrayDialedNumbers.join(',');
        let resultRecentCall;
        try {
          resultRecentCall = await this.telecomService.standardInfoRecentCall(dataRecentCall).toPromise();
          if (!resultRecentCall.status) {
            this.alertService.showError(resultRecentCall.message);
          }
          if(!resultRecentCall.first_time_request) {
            localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO);
            localStorage.setItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO, JSON.stringify(resultRecentCall.data));
          }
          this.router.navigate(['/pages/chuan-hoa-thong-tin/tai-anh-giay-to']);
        } catch (error) {
          this.alertService.showError(error);
        }
      }
    }
  }
  
  ngOnInit(): void {
    this.init();
    this.getData();
  }

  checkMobile(key) {
    this.checkValidMobile = {};
    this.checkValidMobile[key] = true;
  }

  checkMobileGmobile() {
    if(this.formGroup.controls['msisdn'].value.length < 10) {
        this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059" ;
    }
    const list = [
        '099', '059'
    ]
    if(!list.includes(this.formGroup.controls['msisdn'].value.substring(0,3))) {
        this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059" ;
    }
  }

  onFoucsInputMsisdn() {
    this.errorInputMsisdn = '';
  }

  onCompletedInputOtp(code) {
    this.formGroup.patchValue({
      otp: code
    })
  }

  async onResendOTP() {
    let dataRequestOtp = new RequestOtpMobileDto();
    dataRequestOtp.msisdn = this.formGroup.controls['msisdn'].value;
    if(this.currentTaskUpdateInfo) {
      dataRequestOtp.task_id = this.currentTaskUpdateInfo.id;
      dataRequestOtp.request_id = this.currentTaskUpdateInfo.request_id;
    }
    
    try {
      this.timeLeftOtp = 120;
      const r = await this.telecomService.standardInfoResendOtp(dataRequestOtp).toPromise();
      if(!r.status) {
        this.alertService.showError(r.message);
      }      
      this.alertService.showMess(r.message);
      this.isReceiveOtp = true;
      this.startTimer();
      return;
    } catch (error) {
      this.alertService.showError(error);
    }
  }

  startTimer() {
    this.intervalOtp = setInterval(() => {
      if(this.timeLeftOtp > 0) {
        this.timeLeftOtp--;
      } else {
        clearInterval(this.intervalOtp)
      }
    },1000)
  }

  pauseTimer() {
    clearInterval(this.intervalOtp);
  }

  init() {
    this.formGroup = this.formBuilder.group({
      msisdn: [''],
      otp: [''],
      task_id: [''],
      request_id: [''],
      dialed_numbers_1: ['', mobilePhoneValidator()],
      dialed_numbers_2: ['', mobilePhoneValidator()],
      dialed_numbers_3: ['', mobilePhoneValidator()],
      dialed_numbers_4: ['', mobilePhoneValidator()],
      dialed_numbers_5: ['', mobilePhoneValidator()],
    })        
  }

  get f() {
    return this.formGroup.controls;
  }

  getData() {
    const d = localStorage.getItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO) || null;
    this.currentTaskUpdateInfo = d ? JSON.parse(d) : null;
  }
}
