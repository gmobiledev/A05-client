import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { AdminService } from 'app/auth/service/admin.service';
import { DatePipe } from '@angular/common';
import { CommonService } from '@core/services/common.service';

@Component({
  selector: 'form-organiration',
  templateUrl: './form-organiration.component.html',
  providers: [DatePipe]
})
export class FormOrganirationComponent implements OnInit {

  @Input() csubmitted: number = 0;
  @Input() organization: any
  @Output() emitSubmitOrganization = new EventEmitter<any>();
  errorInputMobile = '';
  formOrganization;
  districts = []
  commues = []
  provinces = []
  submitted = false
  delegation_file

  constructor(
    private formBuilder: FormBuilder,
    private adminSerivce: AdminService,
    private alertService: SweetAlertService,
    private datePipe: DatePipe,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.getProvinces()

  }

  get f() {
    return this.formOrganization.controls;
  }


  async ngOnChanges(changes: any) {
    // changes.prop contains the old and the new value...
    console.log("ngOnChanges-FromOrganization", changes, this.organization)
    if (changes.organization && this.formOrganization)
      this.fillFromData()
    // this.submitted = true
    if (changes.csubmitted && changes.csubmitted.currentValue > 0) {
      if (this.f.isDelegation.value) {
        if ( (this.organization.delegation && !this.organization.delegation.id)
         && !this.f.delegation_file.value && (this.organization.delegation && !this.organization.delegation.delegation_file)) {
          this.alertService.showError("File giấy ủy quyền không được để trống", 10000)
          return
        }
        if (!this.f.delegation_no.value) {
          this.alertService.showError("Số giấy ủy quyền không được để trống", 10000)
          return
        }
        if (!this.f.delegation_date.value) {
          this.alertService.showError("Ngày cấp giấy ủy quyền không được để trống", 10000)
          return
        }
      } else {
        this.f.delegation_file.value = ""
        this.f.delegation_no.value = ""
        this.f.delegation_date.value = ""
      }
      if (this.formOrganization && this.formOrganization.invalid) {
        this.submitted = true;
        return;
      }

      this.emitSubmitOrganization.emit(await this.formatData(this.formOrganization.value))
    }
  }

  ngAfterContentInit() {
    // contentChild is set after the content has been initialized
    this.fillFromData();
  }

  async onSelectFileDelegation(event) {
    if (event.target.files && event.target.files[0]) {
      let file = event.target.files[0]
      this.delegation_file = file
      if (["image/jpeg", "image/jpg", "image/png", "application/pdf"].includes(file.type)) {
        if (file.type == "application/pdf")
          this.formOrganization.controls['delegation_extension'].setValue("pdf");
      } else {
        this.alertService.showError("Chỉ chấp nhận dạng ảnh png, jpg và pdf", 30000)
      }
    }
  }

  async formatData(data) {
    let organiration: any = Object.assign({}, data)
    if (data.license_issue_date && data.license_issue_date.year) {
      organiration.license_issue_date = `${data.license_issue_date.year}-${data.license_issue_date.month}-${data.license_issue_date.day}`
    }
    if (this.delegation_file) {
      let x = await this.getBase64(this.delegation_file);
      const regex = /^.*base64,/i;
      organiration.delegation_file = x.toString().replace(regex, '')
    } else {
      delete organiration.delegation_file
      delete organiration.delegation_extension
    }



    return organiration;
  }

  initForm() {
    this.formOrganization = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      license_no: ['', Validators.required],
      license_issue_date: ['', Validators.required],
      license_issue_place: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      commune: ['', Validators.required],
      mobile: ['', [Validators.required]],
      email: ['', [Validators.required]],
      type: ['ORG_PRIVATE', Validators.required],
      delegation_file: [''],
      delegation_extension: [''],
      delegation_date: [''],
      delegation_no: [''],
      delegation_type: ['delegation_type'],
      isDelegation: [false],
      customer_type: ["ORGANIZATION"],
      position: ['']

    })
  }
  fillFromData() {
    if (this.organization) {
      this.formOrganization.patchValue(this.organization)

      if (this.organization.license_issue_date) {
        let license_issue_date = new Date(this.organization.license_issue_date)
        this.formOrganization.patchValue({ license_issue_date: { year: license_issue_date.getFullYear(), month: license_issue_date.getMonth() + 1, day: license_issue_date.getDate() } })
      }

      if (this.organization.province) {
        this.onChangeProvince({ target: { value: this.organization.province } })
      }

      if (this.organization.district) {
        this.onChangeDistrict({ target: { value: this.organization.district } })
      }

      if (this.organization.delegation && this.organization.delegation.delegation_no) {
        let delegation: any = this.organization.delegation
        delegation.isDelegation = true
        this.formOrganization.patchValue(delegation)
      }
    }

  }

  onChangeProvince(event) {
    let id = event.target.value
    this.adminSerivce.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.districts = res.data
        this.commues = []
      }
    })
  }

  onChangeDistrict(event) {
    let id = event.target.value
    this.adminSerivce.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.commues = res.data
      }
    })
  }

  getProvinces() {
    this.adminSerivce.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })
  }
  async getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

}
