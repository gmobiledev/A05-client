import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TelecomServivce } from 'app/auth/service';
import { StandardInfoDetectOcrDto, UploadIndentityDocDto } from 'app/auth/service/dto/standardinfo.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-upload-identity-doc',
  templateUrl: './upload-identity-doc.component.html',
  styleUrls: ['./upload-identity-doc.component.scss']
})
export class UploadIdentityDocComponent implements OnInit {

  currentTaskUpdateInfo: any;

  identificationFrontBase64: string;
  identificationBackBase64: string;
  selfieBase64: string;
  simBase64: string;
  serial_sim: string;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @BlockUI('section-serial-sim') sectionBlocSerialSim: NgBlockUI;

  constructor(
    private router:Router,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService
  ) {
  }

  async onSubmit(){
    if(!this.identificationBackBase64 || !this.identificationFrontBase64 || !this.selfieBase64 || !this.simBase64) {
      this.alertService.showMess("Vui lòng tải đầy đủ ảnh đúng định dạng");
      return;
    }
    let dataPost = new UploadIndentityDocDto();
    dataPost.card_back = this.identificationBackBase64.replace('data:image/png;base64,', '');
    dataPost.card_front = this.identificationFrontBase64.replace('data:image/png;base64,', '');
    dataPost.selfie = this.selfieBase64.replace('data:image/png;base64,', '');
    dataPost.sim_card = this.simBase64.replace('data:image/png;base64,', '');
    dataPost.task_id = this.currentTaskUpdateInfo.id;
    dataPost.request_id = this.currentTaskUpdateInfo.request_id;
    dataPost.serial_sim = this.serial_sim;
    try {
      this.sectionBlockUI.start();
      const r = await this.telecomService.standardInfoUploadIndentity(dataPost).toPromise();
      this.sectionBlockUI.stop();
      if(!r.status) {
        this.sectionBlockUI.stop();
        this.alertService.showError(r.message);
        return;
      }
      this.router.navigate(['/pages/chuan-hoa-thong-tin/xac-nhan-thong-tin'], {state: {people: r.data.people}});
    } catch (error) {
      this.alertService.showError(error);
      return;
    }    
  }

  resizeImage(image) : Promise<string> {
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
  async onFileSelected(event) {
    if(event.target.files[0] && !['image/png', 'image/jpg', 'image/jpeg'].includes(event.target.files[0].type) ) {
      this.alertService.showMess("Vui lòng chọn đúng định dạng png hoặc jpg của ảnh");
      return;
    }
    if(event.target && event.target.files[0]) {
      this.identificationFrontBase64 = await this.resizeImage(event.target.files[0]);
    }        
  }
  async onFileSelectedBack(event) {   
    if(event.target.files[0] && !['image/png', 'image/jpg', 'image/jpeg'].includes(event.target.files[0].type) ) {
      this.alertService.showMess("Vui lòng chọn đúng định dạng png hoặc jpg của ảnh");
      return;
    } 
    if(event.target && event.target.files[0]) {
      this.identificationBackBase64 = await this.resizeImage(event.target.files[0]);
    }
  }
  async onFileSelectedSelfie(event) {
    if(event.target.files[0] && !['image/png', 'image/jpg', 'image/jpeg'].includes(event.target.files[0].type) ) {
      this.alertService.showMess("Vui lòng chọn đúng định dạng png hoặc jpg của ảnh");
      return;
    }
    if(event.target && event.target.files[0]) {
      this.selfieBase64 = await this.resizeImage(event.target.files[0]);
    }
  }

  async onFileSelectedSim(event) {
    if(event.target.files[0] && !['image/png', 'image/jpg', 'image/jpeg'].includes(event.target.files[0].type) ) {
      this.alertService.showMess("Vui lòng chọn đúng định dạng png hoặc jpg của ảnh");
      return;
    }
    if(event.target && event.target.files[0]) {
      this.simBase64 = await this.resizeImage(event.target.files[0]);
      this.sectionBlocSerialSim.start();
      const dataOcr = new StandardInfoDetectOcrDto();
      dataOcr.fileBase64 = this.simBase64.replace('data:image/png;base64,', '');
      dataOcr.object_detect = 'SIM_SERIAL';
      dataOcr.task_id = this.currentTaskUpdateInfo.id;
      dataOcr.request_id = this.currentTaskUpdateInfo.request_id;
      try {
        const resultOCR = await this.telecomService.standardInfoScanSerial(dataOcr).toPromise();
        this.sectionBlocSerialSim.stop();
        if (resultOCR.status && resultOCR.data) {
          this.serial_sim = resultOCR.data;
        }
      } catch (error) {
        this.sectionBlocSerialSim.stop();
      }
    }
  }

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  ngOnInit(): void {
    const d = localStorage.getItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO) || null;
    this.currentTaskUpdateInfo = d ? JSON.parse(d) : null;
  }

}
