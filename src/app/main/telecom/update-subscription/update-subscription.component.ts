import { Component, EventEmitter, Input, OnChanges, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TelecomServivce } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { Observable, ReplaySubject } from 'rxjs';
import Stepper from 'bs-stepper';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ObjectLocalStorage } from 'app/utils/constants';
import { AdminService } from 'app/auth/service/admin.service';
import { FormOrganirationComponent } from 'app/shared/form-organiration/form-organiration.component';
import { FormPersonalComponent } from 'app/shared/form-personal/form-personal.component';
import { OrganizationDocComponent } from 'app/shared/organization-doc/organization-doc.component';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { CommonService } from 'app/utils/common.service';



@Component({
  selector: 'app-update-subscription',
  templateUrl: './update-subscription.component.html',
  styleUrls: ['./update-subscription.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UpdateSubscriptionComponent implements OnInit, OnChanges {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  @ViewChild(FormOrganirationComponent) formOrganization: FormOrganirationComponent;
  @ViewChild(FormPersonalComponent) formPeopleComponent: FormPersonalComponent;
  @ViewChild(OrganizationDocComponent) formOrganDoc: OrganizationDocComponent;


  public currentContract = '';

  public contentHeader: object;
  public ReactiveChangeSimForm: FormGroup;
  public ReactiveUDFormSubmitted = false;
  public ReactiveSerialForm: FormGroup;
  public ReactiveSerialFormSubmit = false;

  private horizontalWizardStepper: any;
  private bsStepper;
  private isExpand = false;

  public msisdnInfo: any
  public task: any;
  public submitted: boolean = false;
  public countries;
  public provinces;
  public dataInput: any;

  public residence_districts = []
  public residence_commues = []
  public home_districts = []
  public home_commues = []
  public residence: any = {}
  public formPeople: FormGroup;
  public urlFile;

  public customerId;
  public msisdnSub;

  myModal: any
  identificationFrontBase64: string;
  identificationBackBase64: string;
  selfieBase64: string
  simBase64: string
  signatureBase64: string
  isLoading = false
  idContract: string
  idUpdate: string


  async horizontalWizardStepperNext() {
    this.submitted = true;
    if(this.formPeopleComponent.formPeople.invalid) {      
      return;
    }
    if (this.idUpdate == null) {
      await this.onSubmitUpdate()
    } else {
      await this.onSubmitUpdateInfo()
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
    private adminSerivce: AdminService,
    private commonService: CommonService,
    private activeRoute: ActivatedRoute,
    private commonDataService: CommonDataService,
  ) {
    this.commonDataService.getContries().subscribe(res => {
      this.countries = res.data;
    });
    this.commonDataService.getProvinces().subscribe(res => {
      this.provinces = res.data;
    })

  }

  async ngOnInit() {

    // content header
    this.contentHeader = {
      headerTitle: 'Cập nhật thông tin',
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
            name: 'Cập nhật thông tin',
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
      serial: ['', Validators.required],
      dialed_numbers: ['', Validators.required]
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

    //kiem tra xem co dang o step
    const step = this.activeRoute.snapshot.paramMap.get('step');
    this.idUpdate = this.activeRoute.snapshot.paramMap.get('id');
    this.customerId = this.activeRoute.snapshot.paramMap.get('customerId');

    if (this.idUpdate != null) {
      this.getInfo(this.idUpdate);
    }

    if (step !== null && step != undefined) {
      this.horizontalWizardStepper.to(2);
    }

  }

  get ReactiveUDForm() {
    return this.ReactiveChangeSimForm.controls;
  }

  get ReactiveUDSerialFrom() {
    return this.ReactiveSerialForm.controls
  }

  async onSubmitUpdate() {
    let dataUpdate = {
      msisdn: this.msisdnSub,
      customer_id: this.customerId,
      people: {},
      note: "Khách hàng yêu cầu"
    }
    this.formPeopleComponent.formPeople.controls['full_address'].setValue(this.formPeopleComponent.formPeople.controls.residence_full_address.value)
    this.formPeopleComponent.formPeople.controls['birth'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['birth_text'].value))
    this.formPeopleComponent.formPeople.controls['identification_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_date_text'].value))
    this.formPeopleComponent.formPeople.controls['identification_expire_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_expire_date_text'].value))

    dataUpdate.people = this.formPeopleComponent.formPeople.value;
    delete dataUpdate.people['signature'];

    this.submitted = true;
    this.updateSub(dataUpdate);
  }


  async getInfo(id) {

    this.telecomService.taskDetail(id).subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.dataInput = res.data

    }, error => {
      this.alertService.showMess(error);
      return;
    })
  }

  async onSubmitUpdateInfo() {
    let dataUpdateInfo = {
      customer_id: this.customerId,
      people_history_id: 0,
      people: {},
      note: "update"
    }
    this.formPeopleComponent.formPeople.controls['full_address'].setValue(this.formPeopleComponent.formPeople.controls.residence_full_address.value)
    this.formPeopleComponent.formPeople.controls['birth'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['birth_text'].value))
    this.formPeopleComponent.formPeople.controls['identification_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_date_text'].value))
    this.formPeopleComponent.formPeople.controls['identification_expire_date'].setValue(this.commonService.convertDateToUnixTime('DD/MM/YYYY', this.formPeopleComponent.formPeople.controls['identification_expire_date_text'].value))


    dataUpdateInfo.people = this.formPeopleComponent.formPeople.value;
    delete dataUpdateInfo.people['signature'];
    
    this.submitted = true;
    
    this.telecomService.putSubscription(this.idUpdate, dataUpdateInfo).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message, 6000);
        return;
      }
      this.updateDocSigner(this.idUpdate);

    }, err => {
      this.alertService.showError(err, 6000);
      return;
    })
  }

  async updateSub(data) {
    this.telecomService.updateSubscription(data).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message, 6000);
        return;
      }
      this.updateDocSigner(res.data.id);
    }, err => {
      this.alertService.showError(err, 6000);
      return;
    })
  }

  async updateDocSigner(id) {
    let dataContract = {
      contract_type: "TELECOM",
      key: 'phieu_thay_doi_thong_tin',
      task_id: id
    }

    this.telecomService.taskDocSigner(dataContract).subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.currentContract = res.data.base64;
      this.idContract = res.data.task_id;
      this.horizontalWizardStepper.next();
      // this.alertService.showSuccess(res.message);

    }, error => {
      this.alertService.showMess(error);
      return;
    })
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
    //gui thông tin 
    this.telecomService.findMsisdn(body).subscribe(res => {
      this.isLoading = false;
      if (!res.status) {
        this.alertService.showError(res.message, 6000);
        return;
      } else if (!res.data) {
        this.alertService.showError("Không tìm thấy thông tin trùng khớp", 6000);
        return;
      }
      this.msisdnInfo = res.data;
      this.customerId = res.data.customer_id
      this.msisdnSub = res.data.msisdn
    }, err => {
      this.isLoading = false;
      this.alertService.showError(err, 6000);
    })

  }

  ReactiveSerialFormOnSubmit() {
    this.ReactiveSerialFormSubmit = true;
    this.isLoading = false;
    // stop here if form is invalid
    if (this.ReactiveSerialForm.invalid) {
      return;
    }
    let data = {
      card_sim: this.simBase64,
      serial: this.ReactiveSerialForm.value.serial + '',
      signature: this.signatureBase64,
      dialed_numbers: this.ReactiveSerialForm.value.dialed_numbers
    }
    this.telecomService.onSubmitChangeSim(this.task.id, data).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message, 6000);
        return;
      }
      this.alertService.showSuccess(res.message);
      this.router.navigate(['/telecom']);

    }, err => {
      this.alertService.showError(err, 6000);
    })

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
    } else if (img == "sefile") {
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

  async updateSignature() {
    let dataSignature = {
      people_history_id: 0,
      signature_base64_image: this.signatureBase64,
      customer_id: this.customerId
    }

    this.telecomService.submitSignature(this.idContract, dataSignature).subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.router.navigate(['/telecom'])
      this.alertService.showSuccess(res.message);

    }, error => {
      this.alertService.showMess(error);
      return;
    })
  }

  ngOnChanges(): void {
    if (this.currentContract) {
      this.urlFile = this.base64ToArrayBuffer(this.currentContract)
    }
  }

  base64ToArrayBuffer(base64): Uint8Array {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }


}


