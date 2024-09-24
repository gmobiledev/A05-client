import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AdminService } from 'app/auth/service/admin.service';
import { CommonService } from 'app/utils/common.service';
import { ObjectLocalStorage } from 'app/utils/constants';
import { TelecomServivce } from 'app/auth/service';
import { CardEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'form-people',
  templateUrl: './people.component.html',
  providers: [DatePipe]
})
export class PeopleComponent implements OnInit, OnChanges {

  @Input() people;
  @Input() csubmitted: number = 0;
  @Input() isOcr: boolean = false;
  @Input() options: string = ''

  @Output() outPeople = new EventEmitter<any>();
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public imageFront;
  public imageBack;
  public imageSelfie;
  public formPeople;
  public submitted: boolean = false;
  public basicDPdata: NgbDateStruct;
  public countries = []
  public provinces = []
  public residence_districts = []
  public residence_commues = []
  public home_districts = []
  public home_commues = []
  public residence: any = {}
  task_id;
  // @ViewChild('peopleFrom') peopleForm;


  constructor(
    private formBuilder: FormBuilder,
    private adminSerivce: AdminService,
    private datePipe: DatePipe,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService,
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.task_id = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK))?.id;
    this.getProvinces();
    this.getCountries();
    console.log('people.component', this.people);

    console.log('formPeople', this.formPeople);
    try {

      // this.formPeople.controls['name'].setValue(this.people.name)
      this.formPeople.patchValue({
        birth: this.people.birth,
        gender: this.people.gender,
        home_address: this.people.home_address,
        identification_date: this.people.identification_date,
        identification_expire_date: this.people.identification_expire_date,
        identification_no: this.people.identification_no,
        identification_place: this.people.identification_place,
        identification_type: this.people.identification_type,
        name: this.people.name,
        residence_address: this.people.residence_address,
        residence_commune: this.people.residence_commune,
        residence_district: this.people.residence_district,
        residence_province: this.people.residence_province,
      });
      // this.fillFromData();
    } catch (error) {
      console.log("people.component error patchValue", error)
    }

    console.log(2222, this.formPeople);

  }

  ngOnChanges(changes: any) {
    // this.formPeople?.reset();
    // changes.prop contains the old and the new value...
    if (changes?.people && this.formPeople) {
      console.log("onchange people component")
      // this.fillFromData();
    };
    if (changes?.csubmitted && changes?.csubmitted?.currentValue > 0) {
      console.log("ngOnChangesPeople", this.formPeople);
      console.log('invalid', this.formPeople?.invalid);
      if (!this.formPeople && this.formPeople?.invalid) {
        console.log(123123);

        this.submitted = true;
        return;
      }
      console.log(9882);

      this.outPeople.emit(this.formatPeople(this.formPeople.value))
    }

  }

  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    console.log(333);

    this.fillFromData();
  }

  get f() {
    return this.formPeople.controls;
  }

  fillFromData() {
    console.log(this.people);

    if (this.people) {
      // this.formPeople?.patchValue(this.people);
      // console.log(this.formPeople);

      if (this.people?.residence_province) {
        this.onChangeResidenceProvince(this.people.residence_province, true)
      }

      if (this.people.residence_district) {
        this.onChangeResidenceDistrict(this.people.residence_district, true)
      }
      if (this.people.home_province) {
        this.onChangeHomeProvince(this.people.home_province, true)
      }
      if (this.people.residence_commune) {
        this.onChangeResidenceCommune(this.people.residence_commune);
      }

      if (this.people.home_district) {
        this.onChangeHomeDistrict(this.people.home_district, true)
      }
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formPeople.controls['identification_front_file'].setValue(this.imageFront.replace(regex, ""));
      if (this.formPeople?.value?.identification_selfie_file && this.imageSelfie && this.formPeople?.value?.identification_front_file && this.imageFront && this.formPeople?.value?.identification_back_file && this.imageBack) {
        this.callCardEkyc();
      }
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageBack = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formPeople.controls['identification_back_file'].setValue(this.imageBack.replace(regex, ""));
      console.log('onSelectFileBack', this.formPeople);
      if (this.formPeople?.value?.identification_selfie_file && this.imageSelfie && this.formPeople?.value?.identification_front_file && this.imageFront && this.formPeople?.value?.identification_back_file && this.imageBack) {
        this.callCardEkyc();
      }
    }
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageSelfie = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formPeople.controls['identification_selfie_file'].setValue(this.imageSelfie.replace(regex, ""));
      if (this.formPeople?.value?.identification_selfie_file && this.imageSelfie && this.formPeople?.value?.identification_front_file && this.imageFront && this.formPeople?.value?.identification_back_file && this.imageBack) {
        this.callCardEkyc();
      }
    }
  }

  callCardEkyc() {
    //goi api card-ekyc
    let data = new CardEkycDto();
    data.card_back = this.formPeople?.value?.identification_back_file;
    data.card_front = this.formPeople?.value?.identification_front_file;
    data.task_id = this.task_id;
    data.isOcr = 1;
    this.sectionBlockUI.start();
    this.telecomService.taskCardEkyc(data).subscribe(res => {
      console.log(res);

      if (!res.status) {
        this.sectionBlockUI.stop();
        this.alertService.showError(res.message);
        return;
      }

      if (res.data) {
        this.formPeople.patchValue({
          birth: res.data.dob,
          gender: res.data.sex,
          // home_address: res.data,
          identification_date: res.data.issue_date,
          identification_expire_date: res.data.doe,
          identification_no: res.data.id,
          identification_place: res.data.issue_loc,
          identification_type: res.data.type,
          name: res.data.name,
          residence_address: res.data.address,
          residence_commune: parseInt(res.data?.address_entities?.ward_code),
          residence_district: parseInt(res.data?.address_entities?.district_code),
          residence_province: parseInt(res.data?.address_entities?.province_code),
        });

        if (this.formPeople?.value?.residence_province) {
          this.onChangeResidenceProvince(this.formPeople?.value?.residence_province, true)
        }

        if (this.formPeople?.value?.residence_district) {
          this.onChangeResidenceDistrict(this.formPeople?.value?.residence_district, true)
        }
        if (this.people.residence_commune) {
          this.onChangeResidenceCommune(this.people.residence_commune);
        }

      }
      this.sectionBlockUI.stop();
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    });
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

  getProvinces() {
    this.adminSerivce.getProvinces().subscribe((res: any) => {
      console.log('getProvinces', res);

      if (res.status == 1) {
        this.provinces = res.data
      }
    })
  }

  getCountries() {
    this.adminSerivce.getContries().subscribe((res: any) => {
      if (res.status == 1) {
        this.countries = res.data
      }
    })
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

  formatPeople(data) {
    console.log('form data', data)
    let people: any = Object.assign({}, data)
    people.home_province = parseInt(data.home_province)
    people.home_district = parseInt(data.home_district)
    people.home_commune = parseInt(data.home_commune)
    people.residence_province = parseInt(data.residence_province)
    people.residence_district = parseInt(data.residence_district)
    people.residence_commune = data.residence_commune ? parseInt(data.residence_commune) : ""

    if (data.identification_date && data.identification_date.year) {
      let identification_date = `${data.identification_date.year}-${data.identification_date.month}-${data.identification_date.day}`
      people.identification_date = Math.floor((new Date(identification_date)).getTime() / 1000);
    } else if (data.identification_date && data.identification_date.split("-").length >= 3) {
      let birthArr = data.identification_date.split("-");
      data.identification_date += '';
      let identification_date = `${birthArr[2]}-${birthArr[1]}-${birthArr[0]}`
      people.identification_date = Math.floor((new Date(identification_date)).getTime() / 1000);
    } else if (data.identification_date && data.identification_date.length == 8) {
      let identification_date = `${data.identification_date.substring(4, 8)}-${data.identification_date.substring(2, 4)}-${data.identification_date.substring(0, 2)}`
      people.identification_date = Math.floor((new Date(identification_date)).getTime() / 1000);
    } else {
      delete people.identification_date
    }

    if (data.birth && data.birth.year) {
      let birth = `${data.birth.year}-${data.birth.month}-${data.birth.day}`
      people.birth = Math.floor((new Date(birth)).getTime() / 1000);
    }
    else if (data.birth && data.birth.split("-").length >= 3) {
      let birthArr = data.birth.split("-");
      data.birth += '';
      let birth = `${birthArr[2]}-${birthArr[1]}-${birthArr[0]}`
      people.birth = Math.floor((new Date(birth)).getTime() / 1000);
    } else if (data.birth && data.birth.length == 8) {
      let birth = `${data.birth.substring(4, 8)}-${data.birth.substring(2, 4)}-${data.birth.substring(0, 2)}`
      people.birth = Math.floor((new Date(birth)).getTime() / 1000);
    } else
      delete people.birth

    if (data.identification_expire_date && data.identification_expire_date.split("-").length >= 3) {
      data.identification_expire_date += '';
      let expireArr = data.identification_expire_date.split("-");
      let identification_expire_date = `${expireArr[2]}-${expireArr[1]}-${[0]}`
      people.identification_expire_date = Math.floor((new Date(identification_expire_date)).getTime() / 1000);
    } else if (data.identification_expire_date && data.identification_expire_date.length == 8) {
      let identification_expire_date = `${data.identification_expire_date.substring(4, 8)}-${data.identification_expire_date.substring(2, 4)}-${data.birth.substring(0, 2)}`
      people.identification_expire_date = Math.floor((new Date(identification_expire_date)).getTime() / 1000);
    } else if (data.identification_expire_date == '') {
      delete people.identification_expire_date
    }


    if (!data.residence_full_address && this.residence) {

      if (data.residence_address.length < 30) {
        console.log('vào đây rồi');

        people.residence_full_address = ""
        people.residence_full_address += people.residence_address ? people.residence_address + "," : ""
        people.residence_full_address += this.residence.commune ? this.residence.commune + "," : ""
        people.residence_full_address += `${this.residence.district},${this.residence.province}`
      } else
        console.log(11112002);

      people.residence_full_address = data.residence_address
    }

    return people;
  }

  onChangeResidenceProvince(id, init = null) {
    console.log('ResidenceProvince', id);

    if (this.provinces.length > 0) {
      console.log(this.provinces);

      this.residence['province'] = (this.provinces.find(item => item.id == id)).title;
      console.log(this.residence);

    }
    this.adminSerivce.getDistricts(id).subscribe((res: any) => {
      console.log(res);

      if (res.status == 1) {
        if (!init) {
          this.formPeople.controls['residence_district'].setValue('');
        }
        this.residence_districts = res.data;
        this.residence_commues = []
      }
    })
  }

  onChangeResidenceDistrict(id, init = null) {
    console.log(id, 'ResidenceDistrict');

    if (this.residence_districts.length > 0) {
      this.residence['district'] = (this.residence_districts.find(item => item.id == id)).title;
      console.log(this.residence['district']);

    }
    this.adminSerivce.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        if (!init) {
          this.formPeople.controls['residence_commune'].setValue('');
        }
        this.residence_commues = res.data
      }
    })
  }

  onChangeResidenceCommune(event) {
    console.log(event, 'ResidenceCommune');

    if (this.residence_commues.length > 0) {
      this.residence['commune'] = (this.residence_commues.find(item => item.id == event)).title;
      console.log(this.residence['commune']);

    }
    // if (event.target['options'])
    //   this.residence['commune'] = event.target['options'][event.target['options'].selectedIndex].text;
  }

  onChangeHomeProvince(id, init = null) {
    this.adminSerivce.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        if (!init) {
          this.formPeople.controls['home_district'].setValue('');
        }
        this.home_districts = res.data
        this.home_commues = []
      }
    })
  }

  onChangeHomeDistrict(id, init = null) {
    this.adminSerivce.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        if (!init) {
          this.formPeople.controls['home_commune'].setValue('');
        }
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

  initForm() {
    this.formPeople = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')]],
      birth: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['VN', [Validators.required]],
      identification_no: ['', [Validators.required]],
      identification_place: ['', [Validators.required]],
      identification_back_file: [''],
      identification_front_file: [''],
      identification_selfie_file: [''],
      identification_date: ['', [Validators.required]],
      identification_type: ['', [Validators.required]],
      identification_expire_date: [""],
      home_country: ['VN', [Validators.required]], //Có trường người nước noài
      home_province: [''],
      home_district: [''],
      home_commune: [''],
      home_address: [''],
      residence_province: ['', [Validators.required]],
      residence_district: ['', [Validators.required]],
      residence_commune: [''],
      residence_address: [''], //Có trường hợp CCCD không có địa chỉ thường chú
      province: ['1'],
      district: ['1'],
      commune: ['1'],
      address: ['1'],
      otpions: [this.options], //any
      mobile: ['', [Validators.required]],
    })

    this.formPeople.statusChanges.subscribe((status) => {
      console.log("formPeople status", status); //status will be "VALID", "INVALID", "PENDING" or "DISABLED"
    });
    this.formPeople.valueChanges.subscribe((value) => {
      console.log('formPeople valueChanges', value);
    });

  }


}
