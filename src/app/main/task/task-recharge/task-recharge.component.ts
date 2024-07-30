import { Component, OnInit } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';
import { PackagesService } from 'app/auth/service/packages.service';
import { DataReCharge } from 'app/auth/service/dto/new-sim.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-recharge',
  templateUrl: './task-recharge.component.html',
  styleUrls: ['./task-recharge.component.scss']
})

export class TaskRechargeComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Tạo đơn hàng',
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
          name: 'Danh sách nạp data',
          isLink: true,
          link: '/task/add-mobile-package'
        },
        {
          name: 'Tạo đơn hàng',
          isLink: false
        }
      ]
    }
  };

  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;
  public listPackage;
  fileExcel;
  submitted: boolean = false;


  public searchSim: any = {
    keyword: '',
    // category_id: 2,
    // take: 10,
  }

  public createData : DataReCharge = {
    package: '',
    msisdn: ''
  }

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private router: Router,
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,
    private readonly packageService: PackagesService,

  ) {

    this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = TaskTelecomStatus[key];
      return obj;
    }, {});
  }

  onFileChangeExcelSerial(event) {
    this.fileExcel = event.target.files[0];
  }

  async onSubmitUploadSerial() {
    if (!this.createData || !this.createData.msisdn && !this.fileExcel) {
      this.alertService.showMess("Vui lòng nhập số điện thoại hoặc tải lên file excel danh sách serial!");
      return;
    } else if(!this.createData.package) {
      this.alertService.showMess("Vui lòng chọn gói cước!");
      return;
    }
    let formData = new FormData();
    formData.append("files", this.fileExcel);
    formData.append("package", this.createData.package);
    formData.append("msisdn", this.createData.msisdn);

    if ((await this.alertService.showConfirm("Bạn có đồng ý add on data?")).value) {
      this.submitted = true;
      this.telecomService.rechargeSim(formData).subscribe(res => {
        this.submitted = false;
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.router.navigate(['/task', res.data.task.id]);
      }, error => {
        this.submitted = false;
        this.alertService.showMess(error);
      })
    }

  }

  onSubmitSearch() {
    // if (!this.createData || !this.createData.msisdn) {
    //   this.alertService.showMess("Vui lòng nhập số điện thoại!");
    //   return;
    // } else if(!this.createData.package){
    //   this.alertService.showMess("Vui lòng chọn gói cước!");
    //   return;
    // } else {
      this.itemBlockUI.start();
      this.telecomService.rechargeSim(this.createData).subscribe(res => {
        this.itemBlockUI.stop();
      }, err => {
        this.itemBlockUI.stop();
        this.alertService.showMess(err);
      })
    // }

  }

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.packageService.getAll({type: 2, category: 'INBOUD_TOUR'}).subscribe(res => {
      this.listPackage = res.data.packages;
    })
  }


  async modalOpen(modal, item) {
    if (item) {
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg',
        backdrop: 'static',
        keyboard: false
      });

    }
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

}
