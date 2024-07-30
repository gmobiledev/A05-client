import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomServivce } from 'app/auth/service';
import { SignDto } from 'app/auth/service/dto/standardinfo.dto';
import { ObjectLocalStorage } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-confirm-pyc',
  templateUrl: './confirm-pyc.component.html',
  styleUrls: ['./confirm-pyc.component.scss']
})
export class ConfirmPycComponent implements OnInit {

  signatureBase64: string
  isExpand: boolean;
  myModal: any;
  modalDoc: any;
  docs: any;
  public urlFile;

  currentTaskUpdateInfo: any;

  onSignature(data) {
    this.signatureBase64 = data;
    const bodyElement = document.body;
    bodyElement.classList.remove('disable-pull-refresh');
    this.isExpand = false;
    if (this.myModal)
      this.myModal.close("Da ky")
  }

  onReUpload(img) {

  }

  async onViewDocument(modal, doc_type) {
    console.log(this.docs[doc_type])
    this.urlFile = await this.base64ToBufferAsync(this.docs[doc_type]);
    this.modalDoc = this.modalService.open(modal, {
      windowClass: 'modal'
    })
  }

  modalOpen(modalBasic) {
    this.myModal = this.modalService.open(modalBasic, {
      windowClass: 'modal'
    })
    this.onReUpload('signature')
  }

  async onSubmit() {
    if(!this.signatureBase64) {
      this.alertService.showMess("Vui lòng ký tên xác nhận");
      return;
    }
    let dataPost = new SignDto();
    dataPost.signature = this.signatureBase64;
    dataPost.task_id = this.currentTaskUpdateInfo.id;
    dataPost.request_id = this.currentTaskUpdateInfo.request_id;
    try {
      const r = await this.telecomService.standardInfoSign(dataPost).toPromise();
      if(!r.status) {
        this.alertService.showError(r.message);
        return;
      }
      localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO);
      this.alertService.showSuccess(r.message);
      var ctx = this;
      window.setTimeout( function(){
        ctx.router.navigate(['/pages/chuan-hoa-thong-tin/hoan-thanh']);
      }, 500 );
    } catch (error) {
      this.alertService.showError(error);
    }
  }

  constructor(
    private router: Router,
    private modalService: NgbModal,
    private readonly telecomService: TelecomServivce,
    private readonly alertService: SweetAlertService
    
  ) { 
    console.log(this.router.getCurrentNavigation().extras.state)
  }

  ngOnInit(): void {
    const d = localStorage.getItem(ObjectLocalStorage.CURRENT_TASK_UPDATE_INFO) || null;
    this.currentTaskUpdateInfo = d ? JSON.parse(d) : null;
    console.log(window.history.state);
    const data = window.history.state;
    if(data) {
      this.docs = data.docs;
    }    
  }

  base64ToArrayBuffer(base64): Uint8Array {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  }

  base64ToBufferAsync(base64) {
    return new Promise((resolve) => {
    var dataUrl = "data:application/pdf;base64," + base64;
  
    fetch(dataUrl)
      .then(res => res.arrayBuffer())
      .then(buffer => {
        resolve(new Uint8Array(buffer));
      })
    })
  }

}
