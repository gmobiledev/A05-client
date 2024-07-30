import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { TelecomServivce } from 'app/auth/service';
import { ConfirmIdentidyDto } from 'app/auth/service/dto/standardinfo.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-confirm-identity-info',
  templateUrl: './confirm-identity-info.component.html',
  styleUrls: ['./confirm-identity-info.component.scss']
})
export class ConfirmIdentityInfoComponent implements OnInit {

  currentTaskUpdateInfo: any;
  peopleInfo: any;
  formData = {
    contact_mobile: '',
    name: '',
    birth: null,
    gender: '',
    country: '',
    id_no: '',
    id_poi: '',
    id_doi: null,
    home_full: '',
    resident_full: ''
  };
  errorInputMobile = '';

  constructor(
    private router:Router,
    private formBuilder: FormBuilder,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService
  ) {
  }
  
  async onSubmit() {
    let dataPost = new ConfirmIdentidyDto();
    dataPost.request_id = this.currentTaskUpdateInfo.request_id;
    dataPost.task_id = this.currentTaskUpdateInfo.id;
    dataPost.name = this.formData.name;
    dataPost.resident_full = this.formData.resident_full;
    dataPost.id_no = this.formData.id_no;
    dataPost.id_doi = this.formData.id_doi;
    dataPost.id_poi = this.formData.id_poi;

    if(!this.formData.birth.year || !this.formData.birth.month || !this.formData.birth.day) {
      this.alertService.showMess('Vui lòng nhập ngày sinh');
      return;
    }
    if(!this.formData.id_doi.year || !this.formData.id_doi.month || !this.formData.id_doi.day) {
      this.alertService.showMess('Vui lòng nhập ngày cấp CCCD');
      return;
    }
    const birth = this.formData.birth.year +  '-' +
      (this.formData.birth.month > 10 ? this.formData.birth.month : '0' + this.formData.birth.month) + '-' +
      (this.formData.birth.day > 10 ? this.formData.birth.day : '0' + this.formData.birth.day);
      console.log(birth);
      dataPost.birth = Math.floor( (new Date(birth)).getTime() / 1000);

    const idDoi = this.formData.id_doi.year +  '-' +
      (this.formData.id_doi.month > 10 ? this.formData.id_doi.month : '0' + this.formData.id_doi.month) + '-' +
      (this.formData.id_doi.day > 10 ? this.formData.id_doi.day : '0' + this.formData.id_doi.day);
      console.log(idDoi);
      dataPost.id_doi = Math.floor( (new Date(idDoi)).getTime() / 1000);

    dataPost.contact_mobile = this.formData.contact_mobile;
    try {
      const r = await this.telecomService.standardInfoConfirmIdentity(dataPost).toPromise();
      if(!r.status) {
        this.alertService.showError(r.message);
        return;
      }
      this.router.navigate(['/pages/chuan-hoa-thong-tin/ky-xac-nhan'], {state: {docs: {pyc: r.data.pyc, ban_cam_ket: r.data.ban_cam_ket}}});
    } catch (error) {
      this.alertService.showError(error);
      return;
    }

  }

  checkMobile() {
    if(this.formData.contact_mobile.length < 10) {
        this.errorInputMobile = "Số điện thoại chưa đúng, Vui lòng nhập đúng định dạng" ;
    }
    const list = [
      '086', '096', '097', '032', '033', '034', '035', '036', '037', '038', '039',
      '091', '094', '088', '083', '084', '085', '081', '082',
      '089', '090', '093', '070', '079', '077', '076', '078',
      '092', '056', '058','099', '059'
    ]
    if(!list.includes(this.formData.contact_mobile.substring(0,3))) {
        this.errorInputMobile = "Số điện thoại chưa đúng, Vui lòng nhập đúng định dạng" ;
    }
  }

  onFoucsInputMobile() {
    this.errorInputMobile = '';
  }

  ngOnInit(): void {
    const d = localStorage.getItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO) || null;
    this.currentTaskUpdateInfo = d ? JSON.parse(d) : null;
    console.log(window.history.state);
    const data = window.history.state;
    if(data) {
      this.peopleInfo = data.people; 
      this.formData.name = this.peopleInfo?.name;
      this.formData.resident_full = this.peopleInfo?.residence_full_address;
      this.formData.id_no = this.peopleInfo?.identification_no;
      this.formData.id_poi = this.peopleInfo?.identification_place;  
      // console.log(this.peopleInfo.ekyc_data.dob) ;
      const dataEkycPeople = this.peopleInfo != undefined ? JSON.parse(this.peopleInfo?.ekyc_data || null) : null;
      if(dataEkycPeople && dataEkycPeople.dob) {
        const arrBirth = dataEkycPeople.dob.split('-');

        this.formData.birth = 
          new NgbDate(
            parseInt(arrBirth[2]),
            parseInt(arrBirth[1]),
            parseInt(arrBirth[0])
          )

          const arrDateIsuse = dataEkycPeople.doi.split('-');
          this.formData.id_doi = 
          new NgbDate(
            parseInt(arrDateIsuse[2]),
            parseInt(arrDateIsuse[1]),
            parseInt(arrDateIsuse[0])
          )
      }
    } 
  }

}
