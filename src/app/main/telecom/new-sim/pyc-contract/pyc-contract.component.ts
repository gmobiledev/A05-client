import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TelecomServivce, UserService } from 'app/auth/service';
import { ObjectLocalStorage, TelecomTaskSubAction } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { CommonService } from 'app/utils/common.service';
import { FileUploader } from 'ng2-file-upload';

const URL = 'https://your-url.com';

@Component({
  selector: 'app-pyc-contract',
  templateUrl: './pyc-contract.component.html',
  styleUrls: ['./pyc-contract.component.scss']
})
export class PycContractComponent implements OnInit, OnChanges {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  @Output() nextStep = new EventEmitter<any>();
  @Output() toNStep = new EventEmitter<any>();
  @Input() currentTaskId;
  @Input() currentContract;
  @Input() currentFileId;
  @Input() personal;
  public urlFile;

  public selectedItem: any;
  public fileContract;
  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  isConfirmTask: boolean = false;  
  imgQrEsim;  

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private commonService: CommonService,
    private userService: UserService,

  ) { }

  onNextStep() {
    if (this.personal)
      this.nextStep.emit({ title: "Chữ ký khách hàng", validate_step: true });
    else {
      const dataPost = {
        task_id: this.currentTaskId,
        file_id: this.currentFileId
      }
      this.telecomService.submitOrganizationContract(dataPost).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess("Khách hàng ký hợp đồng sau đó đẩy lên hệ thống để đấu nối. Cảm ơn Quý khách!", 90000);
        //update Status

        localStorage.removeItem(ObjectLocalStorage.CURRENT_PEOPLE_INFO_NEW_SIM);
        localStorage.removeItem(ObjectLocalStorage.CURRENT_TASK);
        localStorage.removeItem(ObjectLocalStorage.CURRENT_SELECT_MOBILE);
        this.toNStep.emit({ step: 1, clear_data: true });
      }, error => {
        this.alertService.showMess(error);
        return;
      })

    }
  }

  async onConfirmPayment() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý xác nhận đã thanh toán?")).value) {
      let dataPost = {
        task_id: this.currentTaskId
      }
      this.telecomService.confirmPayTask(dataPost).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(!res.message);
          return;
        }

        this.isConfirmTask = true;
        if (res.data.qr) {
          localStorage.setItem(ObjectLocalStorage.ESIMQR, res.data.qr)          
        } else {
          this.alertService.showMess(res.message);
        }

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
          this.urlFile = this.base64ToArrayBuffer(res.data.base64)
        }, error => {
          this.sectionBlockUI.stop();
          this.alertService.showError(error);
          return;
        })

        
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }

  ngOnInit(): void {
  }

  async ngOnChanges(changes) {
    console.log("pyc_changes", changes)
;    const task = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_TASK));
    if(task.sub_action != TelecomTaskSubAction.BUY_ESIM) {
      this.isConfirmTask = true;
    }
    console.log("ngOnChanges this.currentContract", this.currentContract);
    if (this.isConfirmTask && !changes.currentContract.firstChange) {
      console.log("ngOnChanges: create pyc")
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
        this.urlFile = this.base64ToArrayBuffer(res.data.base64)
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showError(error);
        return;
      })   

      // let res;
      // try {
      //   res = await this.telecomService.taskDocSigner(dataContract).toPromise();
      //   if (!res.status) {
      //     this.alertService.showError(res.message);
      //     this.sectionBlockUI.stop();
      //     return;
      //   }
      //   this.sectionBlockUI.stop();        
      //   this.urlFile = this.base64ToArrayBuffer(res.data.base64)
      // } catch (error) {
      //   this.sectionBlockUI.stop();
      //   this.alertService.showError(error);
      //   return;
      // }
      
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

  public uploader: FileUploader = new FileUploader({
    disableMultipart: false,
    itemAlias: 'attachment',
    allowedFileType: ['image', 'pdf'],
  });

  public selectedFiles: File[] = [];


  onFileSelected(event) {
    for (let file of event) {
      this.selectedFiles.push(file)
    }
  }

  onRemoveFile(index, name) {
    this.uploader.queue[index].remove();
    this.selectedFiles = this.selectedFiles.filter(item => item.name != name);    
  }

  async onSubmitUpload() {
    console.log(this.selectedFiles);
    if(this.selectedFiles.length > 0) {
      const formData = new FormData();
      formData.append("entity", 'telecom_task');
      formData.append("key", 'attachments');
      formData.append("object_id", this.currentTaskId);

      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        formData.append(`files`, file);
      }

      if ((await this.alertService.showConfirm("Bạn có muốn tải tệp đính kèm lên")).value) {
        this.itemBlockUI.start();
        this.userService.sumitFile(formData).subscribe(res => {
          this.itemBlockUI.stop();
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          // this.alertService.showSuccess(res.message);
          this.onNextStep();

        }, error => {
          this.itemBlockUI.stop();
          this.alertService.showMess(error);
          return;
        })
      }
    } else {
      this.onNextStep();
    }
  }

}
