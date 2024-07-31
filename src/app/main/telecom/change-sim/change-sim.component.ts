import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TelecomServivce } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
//import { MustMatch } from './_helpers/must-match.validator';
import { Subject, Observable, ReplaySubject } from 'rxjs';
import Stepper from 'bs-stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjectLocalStorage, TelecomTaskSubAction } from 'app/utils/constants';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-change-sim',
  templateUrl: './change-sim.component.html',
  styleUrls: ['./change-sim.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChangeSimComponent implements OnInit {
  // public
  public contentHeader: object;
  public ReactiveChangeSimForm: FormGroup;
  public ReactiveUDFormSubmitted = false;

  public ReactiveSerialForm: FormGroup;
  public ReactiveSerialFormSubmit = false;

  public shipInforForm: FormGroup;
  public submitShipInfo = false;

  // private
  private horizontalWizardStepper: Stepper;
  private bsStepper;
  private isExpand = false;
  
  public msisdnInfo: any
  public task: any;
  public isvalidTask = false;

  identificationFrontBase64: string;
  identificationBackBase64: string;
  selfieBase64: string
  simBase64: string
  signatureBase64: string
  isLoading = false;
  isCheckOcr = 1;

  // Reactive User Details form data
  public ChangeSimForm = {
    mobile: '',
    identification_no: ''
  };

  public SeiralForm = {
    serial: '',
    dialed_numbers: ''
  }
  myModal: any;
  currentSubAction = "";
  isEsim24h = false;
  isVerifyCustomerInfo = false;
  isSubmitSignature = false;
  verifyCallLog = true;
  imgQrEsim;
  isCompleteTask: boolean = false;
  modalRef: any;
  public taskSubAction = TelecomTaskSubAction;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @ViewChild('modalQR') public modalQR: ElementRef | undefined;
  @ViewChild('inputRecentMobile') public inputRecentMobile


  horizontalWizardStepperNext(data) {
    if (data.form.valid === true) {
      this.horizontalWizardStepper.next();
    }
  }
 
  horizontalWizardStepperPrevious() {
    this.horizontalWizardStepper.previous();
  }


  constructor(
    private formBuilder: FormBuilder,
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private router: Router,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer

  ) { }

  async ngOnInit() {
    // content header
    this.contentHeader = {
      headerTitle: 'Thay đổi sim',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Trang chủ',
            isLink: true,
            link: '/'
          },
          {
            name: 'Thay đổi sim',
            isLink: false
          }
        ]
      }
    };
    const currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER) || null);
    if (currentUser && (!isNaN(parseInt(currentUser.full_name)) || !currentUser.full_name)) {
      if ((await this.alertService.showConfirm("Vui lòng cập nhật thông tin cá nhân để tiếp tục", "", "Cập nhật", "Bỏ qua")).value) {
        this.router.navigate(['/profile/user-info']);
      } else {
        this.router.navigate(['/dashboard/home']);
      }
    }
    // Reactive form initialization
    this.ReactiveChangeSimForm = this.formBuilder.group(
      {
        mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
        identification_no: ['', Validators.required],
      }
    );
    this.ReactiveSerialForm = this.formBuilder.group({
      serial: [''],
      // dialed_numbers: ['', Validators.required]
    })

    this.shipInforForm = this.formBuilder.group({
      address: ['', Validators.required],
      mobile: ['', Validators.required]
    })

    this.horizontalWizardStepper = new Stepper(document.querySelector('#stepper1'), {
      linear: false,
      animation: true
    });
    this.bsStepper = document.querySelectorAll('.bs-stepper');
    document.addEventListener(
      'touchmove',
      function (e) {
        e.preventDefault();
      },
      false
    );

  }
  get ReactiveUDForm() {
    return this.ReactiveChangeSimForm.controls;
  }

  get cShipInfoForm() {
    return this.shipInforForm.controls;
  }

  get ReactiveUDSerialFrom() {
    return this.ReactiveSerialForm.controls
  }

  ReactiveUDFormOnSubmit() {
    this.ReactiveUDFormSubmitted = true;

    // stop here if form is invalid
    if (this.ReactiveChangeSimForm.invalid) {
      return;
    }
    let body: any = this.ReactiveChangeSimForm.value
    this.msisdnInfo = null;
    this.isLoading = true;
    // this.sectionBlockUI.start();
    //gui thông tin 
    this.telecomService.findMsisdn(body).subscribe(res => {
      // this.sectionBlockUI.stop();
      this.isLoading = false;
      if (!res.status) {
        this.alertService.showError(res.message, 6000);
        return;
      } else if (!res.data) {
        this.alertService.showError("Không tìm thấy thông tin trùng khớp", 6000);
        return;
      }
      this.msisdnInfo = res.data;
    }, err => {
      // this.sectionBlockUI.stop();
      this.isLoading = false;
      this.alertService.showError(err, 6000);
    })

  }
  async ReactiveSerialFormOnSubmit() {
    this.ReactiveSerialFormSubmit = true;
    this.isLoading = true;
    // stop here if form is invalid
    if (this.ReactiveSerialForm.invalid) {
      return;
    }
    // console.log(this.inputRecentMobile.tags);
    let confirmMess = this.currentSubAction == this.taskSubAction.SIM_TO_ESIM ? "Bạn có đồng ý thực hiện thao tác?" :
    "Bạn có đồng ý đổi SIM sang serial " + this.ReactiveSerialForm.value.serial
    if ((await this.alertService.showConfirm(confirmMess)).value) {
      let data = {
        card_sim: this.simBase64,
        serial: this.ReactiveSerialForm.value.serial + '',
        signature: this.signatureBase64,
        // dialed_numbers: this.ReactiveSerialForm.value.dialed_numbers.join(',')
        dialed_numbers: this.inputRecentMobile.tags.join(',')
      }
      if ([this.taskSubAction.ESIM_REKIT_SIM + '', this.taskSubAction.SIM_TO_ESIM + ''].includes(this.currentSubAction)) {
        delete data['serial'];
        delete data['card_sim'];
      }
      // console.log(data);
      // return;

      this.telecomService.onSubmitChangeSim(this.task.id, data).subscribe(res => {
        if (!res.status) {
          this.isLoading = false;
          this.alertService.showError(res.message, 6000);
          return;
        }

        this.isSubmitSignature = true;
        this.isLoading = false;
        if (![this.taskSubAction.SIM_TO_ESIM + ''].includes(this.currentSubAction)) {
          this.alertService.showSuccess(res.message);
          this.router.navigate(['/telecom']);
        }

      }, err => {
        this.isLoading = false;
        this.alertService.showError(err, 6000);
      })
    }

  }
  async onFileSelected(event) {
    if (event.target && event.target.files[0]) {
      this.identificationFrontBase64 = await this.resizeImage(event.target.files[0]);
    }
  }
  async onFileSelectedBack(event) {
    if (event.target && event.target.files[0]) {
      this.identificationBackBase64 = await this.resizeImage(event.target.files[0]);
    }
  }
  async onFileSelectedSelfie(event) {
    if (event.target && event.target.files[0]) {
      this.selfieBase64 = await this.resizeImage(event.target.files[0]);
    }
  }

  onFileSelectedSim(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.simBase64 = base64;
    });
  }
  onFileSelectedSignature(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.signatureBase64 = base64;
    });
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  onReUpload(img) {
    if (img == 'front') {
      this.identificationFrontBase64 = null;
    } else if (img == 'back') {
      this.identificationBackBase64 = null;
    } else if (img == "selfie") {
      this.selfieBase64 = null;
    } else if (img == "signature") {
      this.signatureBase64 = null
    } else if (img == "sim-card")
      this.simBase64 = null;
  }

  modalOpen(modalBasic) {
    this.myModal = this.modalService.open(modalBasic, {
      windowClass: 'modal'
    })
    this.onReUpload('signature')
  }

  modalQRClose() {
    this.isCompleteTask = true;
    this.modalRef.close();
  }

  resizeImage(image): Promise<string> {
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
  onSignature(data) {
    this.signatureBase64 = data;
    const bodyElement = document.body;
    bodyElement.classList.remove('disable-pull-refresh');
    this.isExpand = false;
    if (this.myModal)
      this.myModal.close("Da ky")
  }
  emittedEventsCard($event) {
    console.log('Action : ', $event);
    this.isExpand = !this.isExpand;
    const bodyElement = document.body;
    if (this.isExpand) {
      bodyElement.classList.add('disable-pull-refresh');
    }
    else {
      bodyElement.classList.remove('disable-pull-refresh');
    }
  }

  async beforeSumitChangeSim() {
    this.isLoading = true;
    let data = {
      card_front: this.identificationFrontBase64.replace('data:image/png;base64,', ''),
      card_back: this.identificationBackBase64.replace('data:image/png;base64,', ''),
      selfie: this.selfieBase64.replace('data:image/png;base64,', ''),
      action: "change_sim",
      check_ocr: this.isCheckOcr,
      msisdn: this.msisdnInfo.msisdn,
      identification_no: this.msisdnInfo.people.identification_no
    }
    if(this.task) {
      data['task_id'] = this.task.task_id;
    }

    this.telecomService.beforeSumitChangeSim(data).subscribe(async res => {
      this.isLoading = false;
      if (!res.status) {
        if(res.code == 'CANT_READ_IDIMAGE' && ![this.taskSubAction.SIM_TO_ESIM + ''].includes(this.currentSubAction)) {
          if ((await this.alertService.showConfirm(res.message, "", "Tiếp tục để duyệt trên admin.g99", "Thực hiện lại")).value === true) {
            this.isCheckOcr = 0;
            this.beforeSumitChangeSim();
          } else {    
            this.isCheckOcr = 1;
            return;                    
          }
        } else {
          this.alertService.showError(res.message, 6000);
        }
        
      } else {
        this.task = res.data;
        if(this.currentSubAction == this.taskSubAction.SIM_TO_ESIM) {
          this.horizontalWizardStepper.next();
        } else {
          this.isVerifyCustomerInfo = true;
        }
      }            
    }, err => {
      this.isLoading = false;
      this.alertService.showError(err, 6000);
    })
  }

  async onSubmitTaskConvertEsim() {
    this.isLoading = true;
    if(!this.task) {
      await this.onInitTask();
    }    
    await this.onSubmitShipInfo();
    this.isLoading = false;
    // this.horizontalWizardStepper.next();
  }

  async onInitTask() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện")).value) {
      let dataPost = {
        mobile: this.msisdnInfo.msisdn,
        action: this.currentSubAction
      }
      try {
        let res = await this.telecomService.initTask(dataPost).toPromise();
        this.task = res.data;  
      } catch (error) {
        this.alertService.showMess(error);
        this.isLoading = false;
        return;
      }
          
    }
  }

  async onSubmitShipInfo() {
    if(this.task) {
      this.submitShipInfo = true;
      if(this.shipInforForm.invalid) {
        return;
      }
      let dataPost = {
        task_id: this.task.task_id,
        title: this.currentSubAction == this.taskSubAction.SIM_TO_ESIM ?  'Qr Esim' : 'Sim',
        ...this.shipInforForm.value
      }
      if(this.currentSubAction == this.taskSubAction.SIM_TO_ESIM) {
        dataPost['email'] = this.shipInforForm.value.address
      }
      try {
        await this.telecomService.addShipInfo(dataPost).toPromise();
        this.isvalidTask = true;
        this.submitShipInfo = false;
      } catch (error) {
        this.alertService.showMess(error);
        this.isLoading = false;
        this.submitShipInfo = false;
        return;
      }
    }        
  }


  onDownloadEsimQR() {
    let dataPost = {
      task_id: this.task.id,
      otp: ''
    }  
    this.telecomService.getEsimQR(dataPost).subscribe(res => {

    })
  }

  async onConfirmPayment() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý xác nhận đã thanh toán phí đổi sim?")).value) {
      // this.imgQrEsim = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATsSURBVO3BQY4kRxLAQDJQ//8yd45+SiBR0S1p1s3sD9a65LDWRYe1LjqsddFhrYsOa110WOuiw1oXHda66LDWRYe1LjqsddFhrYsOa110WOuiw1oXffiSym+q+EkqU8WkMlU8UZkq3lD5TRXfOKx10WGtiw5rXfThsoqbVN5QeaPiicobKk9Upoo3Km5Suemw1kWHtS46rHXRhx+m8kbFGypTxU0Vk8qTikllqphUpoo3VN6o+EmHtS46rHXRYa2LPvxlVJ5UTCpTxaTyRGWqmCr+nxzWuuiw1kWHtS768JepmFQmlaniScUbKlPFpDJV/E0Oa110WOuiw1oXffhhFb9JZaqYVL6h8obKE5Wp4o2Kf5PDWhcd1rrosNZFHy5T+SdVTCpTxaQyVUwqU8WkMlVMKlPFpPKGyr/ZYa2LDmtddFjrog9fqvg3q5hUpoo3VKaKn1TxX3JY66LDWhcd1rrI/uALKlPFpHJTxRsqb1Q8UXlS8UTlScWkclPFTzqsddFhrYsOa1304YdVvKEyVUwqU8WTiicqk8qTiknlGxVPKiaVqWJSmSp+02Gtiw5rXXRY66IP/zCVqWJSeUNlqphUbqqYVN5QmSreUJkqnqhMFTcd1rrosNZFh7Uu+vClijdUnqhMFU9UpopJ5UnFpDJVPFF5o2JSeaPiDZXfdFjrosNaFx3WuujDl1SmikllqnhDZap4o2JSmVSmiknlJpWp4onKVDGpPKl4ojJVfOOw1kWHtS46rHXRhy9VfENlqpgq3lB5UjGpPKmYVJ5UTCpTxROVqWJSmSq+UXHTYa2LDmtddFjrog+XqXxD5RsVT1Smim9UvKFyk8pU8YbKVPGNw1oXHda66LDWRR9+mcobFZPKVDGp3KTyRGWqmCpuqphUJpWp4jcd1rrosNZFh7Uusj/4gspU8YbKVDGpTBWTylQxqbxRcZPKb6p4ojJV3HRY66LDWhcd1rroww9TmSqmiicVk8obFU9UJpU3Kr5RMam8UfENlaniG4e1LjqsddFhrYs+/MNUpopJ5Q2VJxXfqJhUpoqpYlJ5o2JSmVSeVPymw1oXHda66LDWRfYHX1CZKt5QmSqeqEwVk8qTiicqU8UbKlPFE5Wp4hsqb1TcdFjrosNaFx3WuujDL1N5ovKk4o2KSeVJxaTyDZWp4onKNyreUJkqvnFY66LDWhcd1rrI/uA/TOWNit+k8kbFGypTxaQyVUwqU8U3DmtddFjrosNaF334kspvqpgqJpWp4onKVPGGylTxpGJSeaIyVTxRmSomlanipsNaFx3Wuuiw1kUfLqu4SeWJylQxqUwVU8UTlScVk8pU8Y2Kb6hMFZPKVPGNw1oXHda66LDWRR9+mMobFd9QeaIyVTypeKIyVUwqb6h8o+KJylRx02Gtiw5rXXRY66IP/2cq3lCZKp6ovFExqbxRMan8kw5rXXRY66LDWhd9+MtVvKEyVUwqU8U3VKaKSWWqeKNiUvlJh7UuOqx10WGtiz78sIqfVPFE5Y2KSeWJylTxROUmlScqT1Smim8c1rrosNZFh7Uu+nCZym9SeVLxROUmlScVk8qTijcqnqhMFTcd1rrosNZFh7Uusj9Y65LDWhcd1rrosNZFh7UuOqx10WGtiw5rXXRY66LDWhcd1rrosNZFh7UuOqx10WGtiw5rXfQ/WTk+Wy92OU0AAAAASUVORK5CYII=`);
      // this.modalService.open(this.modalQR, {
      //   centered: true,
      //   windowClass: 'modal modal-primary',
      //   size: 'sm',
      //   backdrop: 'static',
      //   keyboard: false
      // });
      let dataPost = {
        task_id: this.task.id
      }
      this.telecomService.confirmPayTask(dataPost).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(!res.message);
          return;
        }
        if(this.currentSubAction != this.taskSubAction.SIM_TO_ESIM) {
          this.horizontalWizardStepper.next();
        } else {
          if(res.data.qr) {
            this.imgQrEsim = this.sanitizer.bypassSecurityTrustResourceUrl(res.data.qr);
  
            this.modalRef = this.modalService.open(this.modalQR, {
              centered: true,
              windowClass: 'modal modal-primary',
              size: 'sm',
              backdrop: 'static',
              keyboard: false
            });
          } else {
            this.alertService.showMess(res.message);                
          }
        }        
        
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }  

  addTagFn = (term) => {
    if ((term.length == 10 || term.length == 11) && /^[0-9]+$/.test(term)) {
        return term;
    }
    return null;
  }
  
  onTypeEmail(event) {
    event.target.value = event.target.value.replace(/[^a-zA-Z0-9-.-@-_]/g, '');
    this.shipInforForm.patchValue({
      address: event.target.value
    })
  }
}
