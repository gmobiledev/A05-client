import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { TelecomServivce, UserService } from 'app/auth/service';
import { SelfieEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-organization-assign',
  templateUrl: './organization-assign.component.html',
  styleUrls: ['./organization-assign.component.scss']
})
export class OrganizationAssignComponent implements OnInit {

  assignType = "OWNER" //OWNER,ONE,MANY
  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  currentTask: any
  currentCustomer: any
  public csubmitted: number = 0;
  public formAssign;
  countValidPeople: number = 0
  people: any = {}

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK))
  }

  checkOwnerIsUse(event) {
    console.log(event, this.assignType);
    if (this.assignType == "OWNER") {
      this.people.mobile = this.currentTask.msisdns[0].msisdn
      this.people.options = this.currentTask.msisdns[0].msisdn
    } else if (this.assignType == "ONE") {
      this.people.mobile = this.currentTask.msisdns[0].msisdn
      this.people.options = this.currentTask.msisdns[0].msisdn
    } else {
    }
  }

  initForm() {
    this.formAssign = this.formBuilder.group({
      msisdns: this.formBuilder.array([])
    })
  }

  get msisdns() {
    return this.formAssign.controls["msisdns"] as FormArray;
  }

  async formPeopleData(formData) {
    console.log("-----------------", formData);
    this.countValidPeople++;

    this.sectionBlockUI.start();
    if (this.assignType == "ONE") {
      if (!formData.id) {
        //tạo khách hàng
        let createCustomerDto = {
          id_no: formData.identification_no,
          id_type: formData.identification_type,
          name: formData.name,
          apeople: formData,
          customer_type: "PERSONAL",
          address: formData.residence_full_address,
          mobile: this.currentTask.msisdns[0].msisdn,
          created_by: "TELECOM"
        }
        let newCus = await this.userService.createCustomer(createCustomerDto);
        if (newCus.status == 1) {
          for (let i = 0; i < this.currentTask.msisdns.length; i++) {
            this.currentTask.msisdns[i].people = {
              id: newCus.data.people.id,
              identification_no: newCus.data.people.identification_no,
              identification_type: newCus.data.people.identification_type,
              name: newCus.data.people.name
            }
          }
        } else {
          this.alertService.showError(newCus.message)
          return;
        }
      } else {
        for (let i = 0; i < this.currentTask.msisdns.length; i++) {
          this.currentTask.msisdns[i].people = { id: formData.id }
        }
      }

      console.log("currenttassk---", this.currentTask)
      this.countValidPeople = this.currentTask.msisdns.length
    } else {
      let msisdns = this.currentTask.msisdns.filter(m => m.msisdn == formData.mobile)
      if (!formData.id) {
        //tạo khách hàng
        let createCustomerDto = {
          id_no: formData.identification_no,
          id_type: formData.identification_type,
          name: formData.name,
          apeople: formData,
          customer_type: "PERSONAL",
          address: formData.residence_full_address,
          mobile: msisdns[0].msisdn,
          created_by: "TELECOM"
        }
        let newCus = await this.userService.createCustomer(createCustomerDto);
        if (newCus.status == 1) {
          msisdns[0].people = {
            id: newCus.data.people.id,
            identification_no: newCus.data.people.identification_no,
            identification_type: newCus.data.people.identification_type,
            name: newCus.data.people.name
          }
        } else {
          this.alertService.showError(newCus.message)
          return;
        }
      } else {
        for (let i = 0; i < this.currentTask.msisdns.length; i++) {
          this.currentTask.msisdns[i].people = { id: formData.id }
        }
      }
    }

    this.sectionBlockUI.stop();
    //Lưu gán
    if (this.countValidPeople == this.currentTask.msisdns.length) {
      this.assignSubscriber()
    } 
  }

  assignSubscriber() {
    this.sectionBlockUI.start();
    if (this.currentTask && this.currentTask.customer)
      this.currentCustomer = this.currentTask.customer
    let assignDto = {
      task_id: this.currentTask.id,
      assign_type: this.assignType,
      customer_id: this.currentCustomer.id,
      msisdns: []
    }
    console.log(assignDto, this.currentCustomer)

    if (this.assignType == "OWNER") {
      for (const msisdn of this.currentTask.msisdns) {
        let assignMsisdn = {
          msisdn: msisdn.msisdn,
          people: this.currentCustomer.people
        }
        assignDto.msisdns.push(assignMsisdn)
      }
    } else {
      for (const msisdn of this.currentTask.msisdns) {
        let assignMsisdn = {
          msisdn: msisdn.msisdn,
          people: msisdn.people
        }
        assignDto.msisdns.push(assignMsisdn)
      }
    }
    //callapi gán
    this.telecomService.assignUserSubscriber(assignDto).subscribe(res => {
      this.sectionBlockUI.stop();
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      this.generateContract()
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    })

  }



  onNextStep() {
    this.countValidPeople = 0;
    this.csubmitted++;
    if (this.assignType == "OWNER") {
      this.assignSubscriber()
    }
  }

  generateContract() {
    let data = new SelfieEkycDto();
    data.task_id = this.currentTaskId;
    this.sectionBlockUI.start();

    //call api tao hop dong
    let dataContract = {
      task_id: this.currentTaskId,
      contract_type: "TELECOM",
    }

    this.telecomService.taskDocSigner(dataContract).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        this.sectionBlockUI.stop();
        return;
      }
      this.sectionBlockUI.stop();
      this.nextStep.emit({ title: "Phiếu yêu cầu/hợp đồng", validate_step: true, doc_contract: res.data.base64, file_id: res.data.file_id });
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showError(error);
      return;
    })
  }
}
