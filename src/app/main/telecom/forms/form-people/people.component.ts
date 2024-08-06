import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AdminService } from 'app/auth/service/admin.service';
import { CommonService } from 'app/utils/common.service';

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
  @ViewChild('peopleFrom') peopleForm;


  constructor(
    private formBuilder: FormBuilder,
    private adminSerivce: AdminService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getProvinces()
    this.getCountries()

  }

  ngOnChanges(changes: any) {
    // changes.prop contains the old and the new value...
    if (changes.people && this.formPeople)
      this.fillFromData()
    if (changes.csubmitted && changes.csubmitted.currentValue > 0) {
      console.log("ngOnChangesPeople", this.formPeople);
      if (this.formPeople && this.formPeople.invalid) {
        this.submitted = true;
        return;
      }

      this.outPeople.emit(this.formatPeople(this.formPeople.value))
    }

  }

  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    this.fillFromData()
  }

  get f() {
    return this.formPeople.controls;
  }

  fillFromData() {
    if (this.people) {
      this.formPeople.patchValue(this.people)
      if (this.people.residence_province) {
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
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageBack = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formPeople.controls['identification_back_file'].setValue(this.imageBack.replace(regex, ""));
    }
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageSelfie = await this.resizeImage(event.target.files[0])
      const regex = /^.*base64,/i;
      this.formPeople.controls['identification_selfie_file'].setValue(this.imageSelfie.replace(regex, ""));
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

  getProvinces() {
    this.adminSerivce.getProvinces().subscribe((res: any) => {
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

  formatPeople(data) {
    console.log('form data', data)
    let people: any = Object.assign({}, data)
    people.home_province = parseInt(data.home_province)
    people.home_district = parseInt(data.home_district)
    people.home_commune = parseInt(data.home_commune)
    people.residence_province = parseInt(data.residence_province)
    people.residence_district = parseInt(data.residence_district)
    people.residence_commune = data.residence_commune ? parseInt(data.residence_commune) : ""

    if (data.identification_date) {
      data.identification_date += '';
      let idateArr = data.identification_date.split("-");
      let identification_date = `${idateArr[2]}-${idateArr[1]}-${idateArr[0]}`
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
        people.residence_full_address = ""
        people.residence_full_address += people.residence_address ? people.residence_address + "," : ""
        people.residence_full_address += this.residence.commune ? this.residence.commune + "," : ""
        people.residence_full_address += `${this.residence.district},${this.residence.province}`
      } else
        people.residence_full_address = data.residence_address
    }

    return people;
  }

  onChangeResidenceProvince(id, init = null) {
    if (this.provinces.length > 0) {
      this.residence['province'] = (this.provinces.find(item => item.id == id)).title;
    }
    this.adminSerivce.getDistricts(id).subscribe((res: any) => {
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
    if (this.residence_districts.length > 0) {
      this.residence['district'] = (this.residence_districts.find(item => item.id == id)).title;
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
    if (this.residence_commues.length > 0) {
      this.residence['commune'] = (this.residence_commues.find(item => item.id == event)).title;
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
      name: ['', Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-Z ]*$')],
      birth: ['', [Validators.required]],
      gender: ['', Validators.required],
      country: ['VN', Validators.required],
      identification_no: ['', Validators.required],
      identification_place: ['', Validators.required],
      identification_back_file: [''],
      identification_front_file: [''],
      identification_selfie_file: [''],
      identification_date: ['', Validators.required],
      identification_type: ['', Validators.required],
      identification_expire_date: [""],
      home_country: ['VN', Validators.required], //Có trường người nước noài
      home_province: [''],
      home_district: [''],
      home_commune: [''],
      home_address: [''],
      residence_province: ['', Validators.required],
      residence_district: ['', Validators.required],
      residence_commune: [''],
      residence_address: [''], //Có trường hợp CCCD không có địa chỉ thường chú
      province: ['1'],
      district: ['1'],
      commune: ['1'],
      address: ['1'],
      otpions: [this.options], //any
      mobile: ['', Validators.required],
    })

  }


}
