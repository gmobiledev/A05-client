import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TelecomServivce, UserService } from 'app/auth/service';
import { ConfirmEkyc } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';

import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbDateCustomParserFormatter } from '../../datepicker-customformat';

@Component({
  selector: 'app-identity-info',
  templateUrl: './identity-info.component.html',
  styleUrls: ['./identity-info.component.scss'],
})
export class IdentityInfoComponent implements OnInit, AfterViewInit {

  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @Input() getDataPeople;
  @Input() personal;
  @Input() currentTask: any;
  @Input() identification_back_file;
  @Input() identification_front_file

  public submitted: boolean = false;
  public csubmitted: number = 0;
  public basicDPdata: NgbDateStruct;

  public countFormValid: number = 0;

  public customer: any = {
    people: {},
    delegation: {}
  }

  public dataPeople;
  public formDataPeople = {
    name: '',
    birth: '',
    gender: '',
    country: '',
    id_no: '',
    id_poi: '',
    home_full: '',
    resident_full: '',
    mobile: ''
  }

  public formConfirm;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private formBuilder: FormBuilder,
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService
  ) { }

  onDateSelection(date: NgbDate) {
    let selectedDate = NgbDateCustomParserFormatter.formatDate(date);
  }

  onNextStep() {
    this.csubmitted++;
    this.countFormValid = 0;
    if (!this.personal) {
      this.submitted = true
      return;
    }

    //call api confirm ekyc    
    this.submitted = false;
    if (this.formConfirm.invalid) {
      this.submitted = true;
      return;
    }
  }

  get f() {
    return this.formConfirm.controls;
  }

  ngOnInit(): void {
    // console.log("identify info current task", this.currentTask)
    this.initForm();
    this.setDataPeople();
  }

  ngOnChanges(changes: any): void {
    this.setDataPeople();
    if (!this.currentTask || !this.currentTask.customer) {
      this.currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK) || null);
      if (this.currentTask && this.currentTask.delegation && this.currentTask.customer.organization) {
        this.currentTask.customer.organization.delegation = this.currentTask.delegation
      }
    }
    // console.log(changes);

    // console.log("---current_task", this.currentTask)

  }

  ngAfterViewInit() {

  }

  setDataPeople() {
    const dataPeopleRaw = localStorage.getItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
    const dataPeopleRecord: any = dataPeopleRaw ? JSON.parse(dataPeopleRaw) : null;
console.log('dataPeopleRecord' , dataPeopleRecord);

    if (dataPeopleRecord) {
      this.dataPeople = {
        name: dataPeopleRecord.name,
        birth: dataPeopleRecord.dob,
        gender: dataPeopleRecord.sex,
        identification_no: dataPeopleRecord.id,
        identification_place: dataPeopleRecord.issue_loc,
        identification_date: dataPeopleRecord.issue_date,
        identification_type: dataPeopleRecord.type,
        home_address: dataPeopleRecord.home,
        identification_expire_date: dataPeopleRecord.doe,
        residence_address: dataPeopleRecord.address,
        residence_province: dataPeopleRecord.address_entities ? parseInt(dataPeopleRecord.address_entities.province_code) : "",
        residence_district: dataPeopleRecord.address_entities ? parseInt(dataPeopleRecord.address_entities.district_code) : "",
        residence_commune: dataPeopleRecord.address_entities ? parseInt(dataPeopleRecord.address_entities.ward_code) : "",
        current_time: new Date().getTime()
      }
      // console.log("xxx", this.dataPeople);
    }
  }

  initForm() {
    this.formConfirm = this.formBuilder.group({
      name: ['', Validators.required],
      birth: [''],
      gender: [''],
      country: [''],
      id_no: ['', Validators.required],
      id_poi: [''],
      home_full: [''],
      resident_full: ['', Validators.required],
      mobile: ['', Validators.required]
    })
  }

  fromOrganizationData(data) {

    // console.log("fromOrganizationData", data);
    this.customer = Object.assign(this.customer, data)
    if (data.isDelegation) {
      this.customer.delegation = {
        delegation_file: data.delegation_file,
        delegation_no: data.delegation_no,
        delegation_date: data.delegation_date,
        delegation_extension: data.delegation_extension,
        delegation_type: "MOBILE"
      }
    } else {
      delete this.customer.delegation
    }
    // if(data.position == ""){
    //   this.alertService.showError("Vị trí người đại diện không được để trống")
    //   return;
    // }
    this.countFormValid++
    if (this.countFormValid >= 2)
      this.updateCustomer()
  }

  formPeopleData(people) {
    // console.log("formPeopleData", people);
    this.countFormValid++
    if (!this.personal) {
      this.customer.people = Object.assign(this.customer.people, people)
      if (this.countFormValid >= 2)
        this.updateCustomer()
      return;
    }

    this.sectionBlockUI.start();
    people.task_id = this.currentTaskId
    if (!people.mobile && people.mobile == "")
      people.mobile = this.currentTask.msisdn

    let confirmEkyc = new ConfirmEkyc(people);
    // console.log(this.currentTask, people, confirmEkyc);

    confirmEkyc.identification_back_file = this.identification_back_file;
    confirmEkyc.identification_front_file = this.identification_front_file;
    this.telecomService.taskConfirmEkyc(confirmEkyc).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        this.sectionBlockUI.stop();
        return;
      }
      this.sectionBlockUI.stop();
      this.nextStep.emit({ title: "Chân dung khách hàng", validate_step: true, personal: this.personal });
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    })
  }


  async updateCustomer() {
    // console.log("Customer", this.customer);
    if (this.sectionBlockUI.isActive) {
      return;
    }
    this.countFormValid = 0;
    this.sectionBlockUI.start();
    await new Promise(f => setTimeout(f, 1000));
    this.customer.id_no = this.customer.license_no
    this.customer.id_type = "LICENSE"

    let dto: any = this.customer
    dto.task_id = this.currentTask.id

    this.telecomService.updateCustomerByTask(dto).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        this.sectionBlockUI.stop();
        return;
      }
      this.sectionBlockUI.stop();
      // console.log("newCustomer", res.data);
      this.currentTask.customer = res.data
      //update delegation
      localStorage.setItem(ObjectLocalStorage.CURRENT_TASK, JSON.stringify(this.currentTask))
      this.nextStep.emit({ title: "Chân dung khách hàng", validate_step: true, personal: this.personal });
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    })

  }



}
