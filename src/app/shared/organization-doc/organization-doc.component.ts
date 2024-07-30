import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-organization-doc',
  templateUrl: './organization-doc.component.html',
  styleUrls: ['./organization-doc.component.scss']
})
export class OrganizationDocComponent implements OnInit {

  @Input() submitted;

  form: FormGroup;
  public license_file;
  public imageFront;
  public imageBack;
  public imageSelfie;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  async onSelectFileSelfie(event) {
    if (event.target.files && event.target.files[0]) {      
    }
  }

  async onSelectFileLicense(event) {

  }
  
  initForm() {
    this.form = this.formBuilder.group({
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
