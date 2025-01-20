import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TelecomServivce, UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import { GSubService } from 'app/auth/service/gsub.service';
import { CardEkycDto } from 'app/auth/service/dto/new-sim.dto';


@Component({
  selector: 'organization-doc',
  templateUrl: './organization-doc.component.html',
  styleUrls: ['./organization-doc.component.scss']
})
export class OrganizationDocComponent implements OnInit {
  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  public formOgzOcr;
  submitted = false;
  currentCustomer: any
  currentTask: any
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private readonly telecomService: TelecomServivce,
    private readonly userService: UserService,
    private readonly alertService: SweetAlertService,
    private gsubService: GSubService
  ) { }

  organizationData: any = {}
  errorInputMobile = '';
  public license_file;
  public imageFront;
  public imageBack;
  public imageSelfie;

  ngOnInit(): void {
    this.initForm()
    this.currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK) || null);
    if (this.currentTask.customer) {
      this.currentCustomer = this.currentTask.customer
    }
    this.setDataForm()
  }

  onFoucsInputMobile() {
    this.errorInputMobile = '';
  }
  checkMobile() {
    if (this.organizationData.contact_mobile.length < 10) {
      this.errorInputMobile = "Số điện thoại chưa đúng, Vui lòng nhập đúng định dạng";
    }
    const list = [
      '086', '096', '097', '032', '033', '034', '035', '036', '037', '038', '039',
      '091', '094', '088', '083', '084', '085', '081', '082',
      '089', '090', '093', '070', '079', '077', '076', '078',
      '092', '056', '058', '099', '059'
    ]
    if (!list.includes(this.organizationData.contact_mobile.substring(0, 3))) {
      this.errorInputMobile = "Số điện thoại chưa đúng, Vui lòng nhập đúng định dạng";
    }
  }
  resizeImage(image) {
    return new Promise((resolve) => {
      let fr = new FileReader;
      fr.onload = () => {
        var img = new Image();
        img.onload = () => {
          // console.log(img.width);
          let width = img.width < 900 ? img.width : 900;
          let height = img.width < 900 ? img.height : width * img.height / img.width;
          // console.log(width, height);
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
  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageBack = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls['identification_back_file'].setValue(this.imageBack.replace(regex, ""));
    }
  }
  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls['identification_front_file'].setValue(this.imageFront.replace(regex, ""));
    }
  }
  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageSelfie = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formOgzOcr.controls['identification_selfie_file'].setValue(this.imageSelfie.replace(regex, ""));
    }
  }
  async onSelectFileLicense(event) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]
      // console.log(file);
      if (["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
        this.license_file = file


        if (file.type == "application/pdf")
          this.formOgzOcr.controls['license_extension'].setValue("pdf");
        else {
          this.alertService.showError("Chỉ chấp nhận file Scan PDF")
          this.license_file = ""
        }
      } else {
        this.alertService.showError("Chỉ chấp nhận dạng ảnh png, jpg và pdf", 30000)
        this.license_file = "";
      }
    }
  }
  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  onReUpload(img) {
    switch (img) {
      case 'front':
        this.imageFront = null;
        break;
      case 'back':
        this.imageBack = null;
        break;
      case 'selfie':
        this.imageSelfie = null;
        break;
      default:
        break;
    }
  }

  async onNextStep() {
    // console.log(this.formOgzOcr);
    if (this.formOgzOcr && this.formOgzOcr.invalid) {
      this.submitted = true;
      return;
    }
    this.sectionBlockUI.start();
    await this.convertOrganizationData()
    this.organizationData.task_id = this.currentTask.id

    // console.log("organization-------------", this.organizationData)
    //goi api card-ekyc
    let data = new CardEkycDto();
    data.card_back = this.organizationData?.identification_back_file;
    data.card_front = this.organizationData?.identification_front_file;
    data.task_id = this.currentTaskId;
    data.documentType = this.formOgzOcr.value.identification_type == 'CCCD' ? 5 : '';
    data.isOcr = 1;
    this.telecomService.taskCardEkyc(data).subscribe(res => {
      // console.log(res);

      // if (!res.status) {
      //   this.sectionBlockUI.stop();
      //   this.alertService.showError(res.message);
      //   return;
      // }
      if (res.data) {
        localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
        localStorage.setItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM, JSON.stringify(res.data));
        //goi api ocr
      } 
      this.newCustomerOCR(res);
      // this.nextStep.emit({
      //   title: "Xác nhận thông tin", validate_step: true, get_data_people: true, identification_front_file: data.card_front,
      //   identification_back_file: data.card_back
      // });
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    });
  }

  newCustomerOCR(dataCardEkyc?){
    this.telecomService.createNewCustomerOCR(this.organizationData).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      if (JSON.stringify(dataCardEkyc.data) === '{}' || JSON.stringify(dataCardEkyc.data) === null) {
        this.alertService.showMess(res.message);
      }
      this.sectionBlockUI.stop();
      this.currentTask.customer = res.data.customer
      this.currentTask.customer.organization = res.data.organization || {}
      this.currentTask.customer.organization.people = res.data.people
      this.currentTask.customer.people = res.data.people
      this.currentTask.people = res.data.people
      this.currentTask.customer.organization.id = this.currentTask.customer.organization_id

      this.gsubService.taskSub.next(this.currentTask);

      localStorage.setItem(ObjectLocalStorage.CURRENT_TASK, JSON.stringify(this.currentTask));
      this.nextStep.emit({ title: "Xác nhận thông tin", validate_step: true, personal: false, get_data_people: true });
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    })
  }

  get f() {
    return this.formOgzOcr.controls;
  }

  async convertOrganizationData() {
    this.organizationData = Object.assign(this.organizationData, this.formOgzOcr.value);
    this.organizationData.id_no = this.organizationData.license_no
    let x = await this.getBase64(this.license_file);
    const regex = /^.*base64,/i;
    this.organizationData.license_file = x.toString().replace(regex, '')
  }

  setDataForm() {
    // console.log(this.currentCustomer);

    if (this.currentCustomer) {
      this.formOgzOcr.patchValue({
        identification_no: this.currentCustomer.people.identification_no,
        identification_type: this.currentCustomer.people.identification_type
      })

      // if (this.currentCustomer.organization && this.currentCustomer.organization.license_no && this.currentCustomer.organization.license_file && this.currentCustomer.people.identification_no &&
      //   this.currentCustomer.people.identification_back_file && this.currentCustomer.people.identification_front_file) {
      //   this.nextStep.emit({ title: "Xác nhận thông tin", validate_step: true, personal: false });
      // }
    }



  }

  initForm() {
    this.formOgzOcr = this.formBuilder.group({
      license_no: ['', Validators.required],
      id_type: "LICENSE",
      customer_type: 'ORGANIZATION',
      identification_no: ['', Validators.required],
      identification_type: ['', Validators.required],
      license_file: ['', Validators.required],
      license_extension: ['', Validators.required],
      identification_back_file: ['', Validators.required],
      identification_front_file: ['', Validators.required],
      identification_selfie_file: ['', Validators.required],
      created_by: ["TELECOM"]
    })
  }

}
