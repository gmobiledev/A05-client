import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { SelfieEkycDto } from 'app/auth/service/dto/new-sim.dto';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-selfie',
  templateUrl: './selfie.component.html',
  styleUrls: ['./selfie.component.scss']
})
export class SelfieComponent implements OnInit,OnChanges {

  @Output() nextStep = new EventEmitter<any>();
  @Input() currentTaskId;


  public imageSelfie;
  
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService
  ) { }

  ngOnChanges(changes): void {
    console.log("Selfie",changes);
  }

  onNextStep() {

    if(!this.imageSelfie) {
      this.alertService.showError("Vui lòng chụp/tải ảnh khách hàng");
      return;
    }
    //call api selfie ekyc
    let data = new SelfieEkycDto();
    data.task_id = this.currentTaskId;
    data.selfie = this.imageSelfie;
    this.sectionBlockUI.start();
    this.telecomService.taskSelfieEkyc(data).subscribe(res => {
      if (!res.status) {
        this.alertService.showError(res.message);
        this.sectionBlockUI.stop();
        return;
      }

      this.nextStep.emit({ title: "Phiếu yêu cầu/hợp đồng", validate_step: true, doc_contract: res })

      // //call api tao hop dong
      // let dataContract = {
      //   task_id: this.currentTaskId,
      //   contract_type: "TELECOM",
      // }

      // this.telecomService.taskDocSigner(dataContract).subscribe(res => {
      //   if (!res.status) {
      //     this.alertService.showError(res.message);
      //     this.sectionBlockUI.stop();
      //     return;
      //   }
      //   this.sectionBlockUI.stop();
      //   this.nextStep.emit({ title: "Phiếu yêu cầu/hợp đồng", validate_step: true, doc_contract: res.data.base64 });
      // }, error => {
      //   this.sectionBlockUI.stop();
      //   this.alertService.showError(error);
      //   return;
      // })      
    }, err => {
      this.alertService.showMess(err);
      this.sectionBlockUI.stop();
      return;
    })
  }

  onReUpload() {
    this.imageSelfie = null
  }

  onSelectFileSelfie(event) {
    this.convertFile(event.target.files[0]).subscribe(base64 => {
      this.imageSelfie = base64;
    });
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

}
