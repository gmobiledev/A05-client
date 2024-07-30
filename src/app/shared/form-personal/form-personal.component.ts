import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-form-personal',
  templateUrl: './form-personal.component.html',
  styleUrls: ['./form-personal.component.scss']
})
export class FormPersonalComponent implements OnInit, OnChanges {

  formPeople: FormGroup;
  @Input() submitted;
  @Input() options: string = ''

  @Input() countries;
  @Input() provinces; //thuong tru
  @Input() dataInput;

  public residence_districts;
  public residence_commues;
  public home_districts;
  public home_commues;
  public residence;

  public imageFront;
  public imageBack;
  public imageSelfie;
  public imageSignature;
  public birthday;



  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private commonDataService: CommonDataService,
    private alertService: SweetAlertService,

  ) {

  }


  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges() {
    if (this.dataInput) {
      this.initForm();

      this.onChangeResidenceProvince(null, this.dataInput.people.residence_province);
      this.onChangeHomeProvince(null, this.dataInput.people.home_province);
      this.onChangeResidenceDistrict(null, this.dataInput.people.residence_district);
      this.onChangeHomeDistrict(null, this.dataInput.people.home_district);

      this.formPeople.controls.name.setValue(this.dataInput.people.name)
      this.formPeople.controls.mobile.setValue(this.dataInput.people.mobile)
      this.formPeople.controls.gender.setValue(this.dataInput.people.gender)
      this.formPeople.controls.country.setValue(this.dataInput.people.country);

      this.formPeople.controls.identification_type.setValue(this.dataInput.people.identification_type)
      this.formPeople.controls.identification_place.setValue(this.dataInput.people.identification_place)
      this.formPeople.controls.identification_no.setValue(this.dataInput.people.identification_no)
      this.formPeople.controls.identification_front_file.setValue(this.dataInput.people.identification_front_file);
      this.formPeople.controls.identification_back_file.setValue(this.dataInput.people.identification_back_file);
      this.formPeople.controls.identification_selfie_file.setValue(this.dataInput.people.identification_selfie_file);
      this.formPeople.controls.identification_signature_file.setValue(this.dataInput.people.identification_signature_file);

      this.formPeople.controls.home_country.setValue(this.dataInput.people.country)
      this.formPeople.controls.home_province.setValue(this.dataInput.people.home_province)

      this.formPeople.controls.home_district.setValue(this.dataInput.people.home_district)
      this.formPeople.controls.home_commune.setValue(this.dataInput.people.home_commune)
      this.formPeople.controls.home_address.setValue(this.dataInput.people.home_address)

      this.formPeople.controls.residence_address.setValue(this.dataInput.people.residence_address)
      this.formPeople.controls.residence_full_address.setValue(this.dataInput.people.residence_full_address)
      this.formPeople.controls.residence_province.setValue(this.dataInput.people.home_province)

      this.formPeople.controls.residence_district.setValue(this.dataInput.people.residence_district)
      this.formPeople.controls.residence_commune.setValue(this.dataInput.people.residence_commune)
      this.formPeople.controls.district.setValue(this.dataInput.people.district)

      this.formPeople.controls.commune.setValue(this.dataInput.people.commune)
      this.formPeople.controls.address.setValue(this.dataInput.people.address)
      this.formPeople.controls.full_address.setValue(this.dataInput.people.full_address)

      if (this.dataInput.people.birth !== null && this.dataInput.people.birth !== '') {
        this.formPeople.controls.birth_text.setValue(this.commonService.formatDateFromTimestamp(this.dataInput.people.birth))
      }

      if (this.dataInput.people.identification_date !== null && this.dataInput.people.identification_date !== '') {
        this.formPeople.controls.identification_date_text.setValue(this.commonService.formatDateFromTimestamp(this.dataInput.people.identification_date))
      }

      if (this.dataInput.people.identification_expire_date !== null && this.dataInput.people.identification_expire_date !== '') {
        this.formPeople.controls.identification_expire_date_text.setValue(this.commonService.formatDateFromTimestamp(this.dataInput.people.identification_expire_date))
      }

      this.imageFront = 'data:image/png;base64,' + this.dataInput.people.identification_front_file
      this.imageBack = 'data:image/png;base64,' + this.dataInput.people.identification_back_file
      this.imageSelfie = 'data:image/png;base64,' + this.dataInput.people.identification_selfie_file
      this.imageSignature = 'data:image/png;base64,' + this.dataInput.people.identification_signature_file
      console.log(this.dataInput)
    }

  }

  onChangeResidenceProvince(event, id = null) {

    id = id ? id : event
    this.commonDataService.getDistricts(id).subscribe((res: any) => {

      if (res.status == 1) {
        this.residence_districts = res.data;
        this.residence_commues = []
      }
    })
  }

  onChangeResidenceDistrict(event, id = null) {
    id = id ? id : event
    this.commonDataService.getCommunes(id).subscribe((res: any) => {

      if (res.status == 1) {
        this.residence_commues = res.data
      }
    })
  }

  onChangeHomeProvince(event, id = null) {
    id = id ? id : event
    this.commonDataService.getDistricts(id).subscribe((res: any) => {

      if (res.status == 1) {
        this.home_districts = res.data
        this.home_commues = []
      }
    })
  }

  onChangeHomeDistrict(event, id = null) {
    id = id ? id : event
    this.commonDataService.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.home_commues = res.data
      }
    })
  }

  onChangeIdentificationType(event) {
    let id = event.target.value
    if (id == "CCCD" || id == "CCCD_CHIP") {
      this.formPeople.patchValue({
        identification_place: "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI"
      })
    } else {
      this.formPeople.patchValue({
        identification_place: ""
      })
    }

  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.imageFront = image;
      this.formPeople.controls['identification_front_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.imageBack = image;
      this.formPeople.controls['identification_back_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.imageSelfie = image;
      this.formPeople.controls['identification_selfie_file'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  async onSelectFileSignature(event) {
    if (event.target.files && event.target.files[0]) {
      const image = await this.commonService.resizeImage(event.target.files[0]) + '';
      this.imageSignature = image;
      this.formPeople.controls['signature'].setValue(image.replace('data:image/png;base64,', ''));
    }
  }

  get f() {
    return this.formPeople.controls;
  }

  onReUpload(img) {
    if (img == 'front') {
      this.imageFront = null;
    }
    if (img == 'back') {
      this.imageBack = null;
    }
    if (img == 'selfie') {
      this.imageSelfie = null;
    }
    if (img == 'signature') {
      this.imageSignature = null;
    }
  }

  initForm() {
    this.formPeople = this.formBuilder.group({
      name: ['', Validators.required],
      birth: [''],
      birth_text: ['', [Validators.required]],
      gender: ['', Validators.required],
      country: ['VN', Validators.required],
      identification_no: ['', Validators.required],
      identification_place: ['', Validators.required],
      identification_back_file: [''],
      identification_front_file: [''],
      identification_selfie_file: [''],
      identification_date: [''],
      identification_date_text: ['', Validators.required],
      identification_type: ['', Validators.required],
      identification_expire_date: [""],
      identification_expire_date_text: [""],
      home_country: ['VN', Validators.required], //Có trường người nước noài
      home_province: ['-1'],
      home_district: ['-1'],
      home_commune: ['-1'],
      home_address: [''],
      residence_province: ['-1'],
      residence_district: ['-1'],
      residence_commune: ['-1'],
      residence_address: [''], //Có trường hợp CCCD không có địa chỉ thường chú
      residence_full_address: ['', Validators.required],
      province: ['-1'],
      district: ['-1'],
      commune: ['-1'],
      address: [''],
      full_address: [""],
      otpions: [this.options], //any
      mobile: ['', Validators.required],
      signature: [''],
      identification_signature_file: ['']
    })

  }

}
