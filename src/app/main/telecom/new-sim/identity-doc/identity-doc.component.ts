import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { CardEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-identity-doc',
  templateUrl: './identity-doc.component.html',
  styleUrls: ['./identity-doc.component.scss']
})
export class IdentityDocComponent implements OnInit {

  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;
  identificationType = '';
  public imageFront;
  public imageBack;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService
  ) { }

  onNextStep() {

    //goi api card-ekyc
    if (!this.imageBack || !this.imageFront) {
      this.alertService.showError("Vui lòng chụp hoặc tải ảnh giấy tờ");
      return;
    }
    if (!this.identificationType) {
      this.alertService.showError("Vui lòng chọn loại giấy tờ");
      return;
    }
    let data = new CardEkycDto();
    data.card_back = this.imageBack.replace('data:image/png;base64,', '');
    data.card_front = this.imageFront.replace('data:image/png;base64,', '');
    data.task_id = this.currentTaskId;
    data.documentType = this.identificationType == 'CCCD' ? 5 : '';
    data.isOcr = 1;
    this.sectionBlockUI.start();
    this.telecomService.taskCardEkyc(data).subscribe(res => {
      if (!res.status) {
        this.sectionBlockUI.stop();
        this.alertService.showError(res.message);
        return;
      }
      this.sectionBlockUI.stop();
      if(res.data) {
        localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
        localStorage.setItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM, JSON.stringify(res.data));
        
      this.nextStep.emit({ title: "Xác nhận thông tin", validate_step: true, get_data_people: true, identification_front_file: data.card_front,
        identification_back_file: data.card_back });
      }      
    }, error => {
      this.alertService.showError(error);
      this.sectionBlockUI.stop();
      return;
    })

  }

  onReUpload(img) {
    if (img == 'front') {
      this.imageFront = null;
    }
    if (img == 'back') {
      this.imageBack = null;
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageFront = await this.resizeImage(event.target.files[0])
    }
  }

  async onSelectFileBack(event) {
    if (event.target.files && event.target.files[0]) {
      this.imageBack = await this.resizeImage(event.target.files[0])
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

  convertFile(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }

  ngOnInit(): void {        
  }

  ngOnChanges() {
    const currentTask = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK || null));
    console.log('id doc', currentTask);
    const people = currentTask && currentTask.customer && currentTask.customer.people ? currentTask.customer.people : null;
    this.imageFront = people && people.identification_front_file ? 'data:image/png;base64,' + people.identification_front_file : null;
    this.imageBack = people && people.identification_back_file ? 'data:image/png;base64,' + people.identification_back_file : null;
  }

  ekycOrganization(data) {
    console.log("ekycOrganization",data);
    this.nextStep.emit({ title: "Xác nhận thông tin", validate_step: true, personal:false });
  }

}
