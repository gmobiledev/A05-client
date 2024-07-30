import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-organiration',
  templateUrl: './form-organiration.component.html',
  styleUrls: ['./form-organiration.component.scss']
})
export class FormOrganirationComponent implements OnInit {

  formOrganization: FormGroup;
  @Input() submitted;
  @Input() provinces;
  @Input() districts;
  @Input() commues;
  @Input() countries;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.formOrganization.controls;
  }
  
  onChangeDistrict(e) {

  }

  onChangeProvince(e) {

  }

  onChangeResidenceProvince(e) {

  }

  onChangeResidenceDistrict(e) {

  }

  onChangeResidenceCommune(e) {

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

}
