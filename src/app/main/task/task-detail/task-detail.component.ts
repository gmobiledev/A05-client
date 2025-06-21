import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from 'app/auth/service';
import { PackagesService } from 'app/auth/service/packages.service';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { MsisdnStatus, ServiceCode, SimType, TaskStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TaskDetailComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI('section-block') itemBlockUI: NgBlockUI;
  
  public contentHeader: any = {
    headerTitle: 'Chi tiết xác nhận ĐKTTTB',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'Home',
          isLink: true,
          link: '/'
        },
        {
          name: 'Chi tiết xác nhận ĐKTTTB',
          isLink: false
        }
      ]
    }
  };

  public id;
  public data;
  public taskStatus = TaskStatus;
  public msisdnStatus = MsisdnStatus;
  public taskServiceCode = ServiceCode;
  fileExcel;
  filePay;
  modalRef;
  listSerial;
  listSerialShow;
  simType = SimType;
  submitted: boolean = false;
  basicSelectedOption = 25;
  currency = 'VND';
  price = 0;
  sim_type;
  dataUpdate = {
    amount: 0
  }
  invalidMsisdns: any[] = [];
  @ViewChild('msisdnStatesModal') msisdnStatesModal: TemplateRef<any>;

  constructor(
    private readonly modalService: NgbModal,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private readonly commonService: CommonService,
    private readonly packageService: PackagesService,
    private readonly route: ActivatedRoute,
    private alertService: SweetAlertService,
    private readonly router: Router,
  
  ) { 
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnInit(): void {
    
  }
  
  async onConfirmTask() {
    let dataPost = {
      id: this.data.id
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý xác nhận đơn?")).value) {
      this.taskService.comfirmTask(dataPost).subscribe(res => {
        const taskId = res.data.data;
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

  async onCancelTask() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý hủy đơn?")).value) {
      this.taskService.getTaskDelete(this.data.id).subscribe(res => {
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

  async onSubmitUploadSerial() {
    if(!this.fileExcel) {
      this.alertService.showMess("Vui lòng tải lên file excel danh sách serial");
      return;
    }
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("id", this.id);
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên file excel danh sách serial?")).value) {
      this.submitted = true;
      this.taskService.uploadSerial(formData).subscribe(res => {
        this.submitted = false;
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.submitted = false;
        this.alertService.showMess(error);
      })
    }

  }
  
  async onSelectFileConfirmPay(event) {
    if (event.target.files && event.target.files[0]) {
      this.filePay = await this.commonService.resizeImage(event.target.files[0])
    }
  }
  async onConfirmPay() {

    if (this.filePay == null) {
      this.alertService.showMess("Vui lòng tải file ảnh thanh toán lên!");
      return;
    }

    let confirmMessage: string;
    confirmMessage = "Xác nhận đã thanh toán thành công?";

    let fileImage = { "file": this.filePay.replace('data:image/png;base64,', '') }

    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.submitted = true;
      this.taskService.comfirmPayment(this.id, fileImage).subscribe(res => {
        this.submitted = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, err => {
        this.submitted = false;
        this.alertService.showError(err);
      })
    }
  }

  async onConfirmUpdate () {
    if (!this.dataUpdate.amount) {
      this.alertService.showMess("Vui lòng nhập số lượng!");
      return;
    }
    
    if ((await this.alertService.showConfirm('Bạn có đồng ý cập nhật đơn này?')).value) {
      this.submitted = true;
      let dataPost = {
        amount: this.dataUpdate.amount,
        sim_type: this.sim_type
      }
      this.taskService.updateSimProfile(this.id, dataPost).subscribe(res => {
        this.submitted = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, err => {
        this.submitted = false;
        this.alertService.showError(err);
      })
    }
  }

  onFileChangeExcelSerial(event) {
    this.fileExcel = event.target.files[0];
  }

  modalOpen(modal) {
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
  }

  modalClose() {
    this.modalRef.close();
  }

  getJSONDetail(key, detail = null) {
    if(!detail) {
      detail = this.data.detail;
    }
    const r =  detail ? JSON.parse(detail) : null;
    if(!r) {
      return null;
    }
    return r[key] ? r[key] : ( ['kitted', 'failed', 'successed'].includes(key) ? 0 : null )
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    let temp;
    if (this.data.service_code == ServiceCode.SIM_PROFILE) {
      temp = this.listSerial.filter(function (d) {
        return d.name.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else if (this.data.service_code == ServiceCode.SIM_KITTING || this.data.service_code == ServiceCode.SIM_KITTING_ESIM || this.data.service_code == ServiceCode.SIM_REGISTER
      || this.data.service_code == ServiceCode.SIM_BUNDLE
    ) {
      temp = this.listSerial.filter(function (d) {
        return d.msisdn.toLowerCase().indexOf(val) !== -1 || d.serial.toLowerCase().indexOf(val) !== -1 || !val;
      });
    } else if (this.data.service_code == ServiceCode.ADD_MOBILE_PACKAGE) {
      temp = this.listSerial.filter(function (d) {
        return d.value.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }

    this.listSerialShow = temp;
    this.table.offset = 0;
  }

  selectedStatus: string | null = null;

  onChangeStateMsisnd(val: string | null) {
    console.log('Trạng thái lọc:', val, typeof val);

    let temp;
    if (val !== null) {
      temp = this.listSerial.filter(x => x.state == val);
    } else {
      temp = this.listSerial.filter(x => x.state == null);
    }

    this.listSerialShow = temp;
    this.table.offset = 0;
  }


  async onUpdateStateMsisndRetry(event, id) {
    const val = event.target.value;
    if ((await this.alertService.showConfirm('Bạn có đồng ý cập nhật?')).value) {
      let data = {
        state: parseInt(val)
      }
      this.taskService.updateStateRetry(id, data).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        return;
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

  exportExcel() {
    if(this.data.service_code == ServiceCode.SIM_PROFILE) {
      const dataExcel = this.listSerial.map(x => {return {'serial': x.name}})
      this.commonService.exportExcel(dataExcel, 'danh sach.xlsx');
    } else if(this.data.service_code == ServiceCode.SIM_KITTING || this.data.service_code == ServiceCode.SIM_KITTING_ESIM || this.data.service_code == ServiceCode.SIM_REGISTER
      || this.data.service_code == ServiceCode.SIM_BUNDLE
    ) {
      this.commonService.exportExcel(this.listSerial, 'danh sach.xlsx');
    } else if(this.data.service_code == ServiceCode.ADD_MOBILE_PACKAGE) {
      const data = [];
      for(let item of this.listSerial) {
        let statusTxt;
        let status = this.getJSONDetail('status', item.desc);
        if(status == null) {
          statusTxt = 'Chưa xử lý';
        } else if (status == this.taskStatus.STATUS_SUCCESS) {
          statusTxt = 'Thành công';
        } else if (status == this.taskStatus.STATUS_FAIL) {
          statusTxt = 'Thất bại';
        }
        data.push({
          msisdn: item.value,
          status: statusTxt,
          note: this.getJSONDetail('desc', item.desc)
        })
      }
      this.commonService.exportExcel(data, 'danh sach.xlsx');
    }
    
  }

  async onRetryTask() {
    let dataPost = {
      id: this.data.id
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện lại?")).value) {
      this.taskService.retryTask(dataPost).subscribe(res => {
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

  onCheckMsisdnStates() {
    this.modalService.open(this.msisdnStatesModal, { size: 'lg', centered: true });
  }
  getInvalidMsisdns() {
    this.taskService.getMsisdn(this.data.id).subscribe({
      next: (res) => this.invalidMsisdns = res || [],
      error: (err) => this.alertService.showMess(err)
    });
  }
  async getData() {
    this.itemBlockUI.start();
    let res = await this.taskService.getTaskDetail(this.id).toPromise();
    this.data = res.data;
    console.log(this.data);
    this.sim_type = this.data?.detail ? JSON.parse(this.data?.detail).sim_type : '';
    this.dataUpdate.amount = res.data.amount;
    this.listSerial = res.data.details.filter(x => x.attribute == 'serial');
    this.listSerialShow = res.data.details.filter(x => x.attribute == 'serial');
    if(res.data.service_code == ServiceCode.SIM_KITTING || res.data.service_code == ServiceCode.SIM_KITTING_ESIM || res.data.service_code == ServiceCode.SIM_REGISTER
      || res.data.service_code == ServiceCode.SIM_BUNDLE
    ) {
      this.listSerial = res.data.msisdns;
      this.listSerialShow = res.data.msisdns;
    } else if (res.data.service_code == ServiceCode.ADD_MOBILE_PACKAGE ) {
      this.listSerial = res.data.details.filter(x => x.attribute == 'msisdn');
      this.listSerialShow = res.data.details.filter(x => x.attribute == 'msisdn');
    }
    this.price = res.data.amount;
    this.itemBlockUI.stop();

    if([ServiceCode.SIM_KITTING, ServiceCode.SIM_KITTING_ESIM, ServiceCode.SIM_BUNDLE].includes(res.data.service_code)) {
      const packgeItems = await this.packageService.getAll({code: this.getJSONDetail('package')}).toPromise();
      this.price = packgeItems.data.packages[0].price * res.data.msisdns.length;
    } else if ([ ServiceCode.ADD_MOBILE_PACKAGE].includes(res.data.service_code)) {
      const packgeItems = await this.packageService.getAll({code: this.getJSONDetail('package')}).toPromise();
      this.price = packgeItems.data.packages[0].price * res.data.details.filter(x => x.attribute == 'msisdn').length;
    }
   if (this.data.service_code == ServiceCode.SIM_KITTING) {
      this.contentHeader.headerTitle = 'Chi tiết đơn kitting';
      this.contentHeader.breadcrumb.links[1].name = 'Danh sách kitting';
      this.contentHeader.breadcrumb.links[1].link = '/task/kitting';
      this.currency = '';
    } else if (this.data.service_code == ServiceCode.SIM_REGISTER) {
        this.getInvalidMsisdns();

      this.contentHeader.headerTitle = 'Chi tiết yêu cầu ĐKTTTB';
      this.contentHeader.breadcrumb.links[1].name = 'Danh sách yêu cầu ĐKTTTB';
      this.contentHeader.breadcrumb.links[1].link = '/task/sim-register';
      this.currency = '';
    }
  }

}
