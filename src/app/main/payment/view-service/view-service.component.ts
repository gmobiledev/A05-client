import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoreConfigService } from '@core/services/config.service';
import { TelecomServivce } from 'app/auth/service';
import { mobilePhoneValidator } from 'app/shared/custom-validator';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { UserService } from 'app/auth/service';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';


@Component({
  selector: 'app-view-service',
  templateUrl: './view-service.component.html',
  styleUrls: ['./view-service.component.scss']
})

export class ViewServiceComponent implements OnInit {
  public coreConfig: any;
  formGroup: any;
  errorInputMsisdn: string;
  submitted: boolean = false
  public contentHeader: any;
  public data: any;
  public id: any;
  public listFiles: any;

  public fileAccount: any;
  public imageFront;
  public imageBack;
  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private _coreConfigService: CoreConfigService,
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService,
    private titleService: Title,
    private userService: UserService,
  ) {
    this._unsubscribeAll = new Subject();

  }

  ngOnInit(): void {

    this.contentHeader = {
      headerTitle: 'Thông tin thanh toán',
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
            name: 'Mã QRCODE',
            isLink: false
          }
        ]
      }
    };
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  getData(): void {
    this.taskService.getTaskDetail(this.id).subscribe(res => {
      this.data = res.data;
    });
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      msisdn: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), mobilePhoneValidator()]],
    })
  }

  async onSelectFileAccount(event) {
    this.fileAccount = event.target.files[0];
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
    }
  }

  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader;
      fr.onload = () => {
        var img = new Image();
        img.onload = () => {
          console.log(img.width);
          let width = img.width < 900 ? img.width : 900;
          let height = img.width < 900 ? img.height : width * img.height / img.width;
          console.log(width, height);
          let canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          let ctx = canvas.getContext('2d');
          if (ctx != null) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          let data = canvas.toDataURL('image/png');
          resolve(data);
        };

        // @ts-ignore
        img.src = fr.result;
      };

      fr.readAsDataURL(image);
    })
  }

  onReUpload(img) {
    if (img == 'front') {
      this.imageFront = null;
    }
    if (img == 'back') {
      this.imageBack = null;
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  checkMobileGmobile() {
    if (this.formGroup.controls['msisdn'].value.length < 10) {
      this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059";
    }
    const list = [
      '099', '059'
    ]
    if (!list.includes(this.formGroup.controls['msisdn'].value.substring(0, 3))) {
      this.errorInputMsisdn = "Số điện thoại chưa đúng, Vui lòng nhập đúng đầu số 099 hoặc 059";
    }
  }

  onFoucsInputMsisdn() {
    this.errorInputMsisdn = '';
  }

  submit() {
    if (this.formGroup && this.formGroup.invalid) {
      this.submitted = true;
      return;
    }
    if (this.errorInputMsisdn.length > 0) {
      this.submitted = true;
      return;
    }
    console.log(this.formGroup.value);
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
      }
    }, err => {
      // this.sectionBlockUI.stop();
      this.alertService.showError(err, 160000);
    })
  }


  async onConfirmPay() {

    if (this.imageFront == null) {
      this.alertService.showMess("Vui lòng tải file ảnh thanh toán lên!");
      return;
    }

    let confirmMessage: string;
    confirmMessage = "Xác nhận đã thanh toán thành công?";

    let fileImage = { "file": this.imageFront.replace('data:image/png;base64,', '') }

    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.taskService.comfirmPayment(this.id, fileImage).subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

}


