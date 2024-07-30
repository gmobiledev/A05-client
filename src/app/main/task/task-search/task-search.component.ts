import { Component, OnInit } from '@angular/core';
import { TelecomServivce } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-task-search',
  templateUrl: './task-search.component.html',
  styleUrls: ['./task-search.component.scss']
})
export class TaskSearchComponent implements OnInit {

  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;
  productListAll: any;

  public searchSim: any = {
    keyword: '',
    // category_id: 2,
    // take: 10,
  }

  @BlockUI('section-block') itemBlockUI: NgBlockUI;

  constructor(
    private telecomService: TelecomServivce,
    private alertService: SweetAlertService,
    private userService: UserService,
    private modalService: NgbModal,

  ) {

    this.taskTelecomStatus = Object.keys(TaskTelecomStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = TaskTelecomStatus[key];
      return obj;
    }, {});
  }
  onSubmitSearch() {
    console.log(this.searchSim);
    this.itemBlockUI.start();
    this.telecomService.getDetailSim(this.searchSim).subscribe(res => {
      this.itemBlockUI.stop();
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.item = res.data
        this.total = res.data.count;
      } else if (!res.data || Object.keys(res.data).length === 0) {
        this.item = null
        this.showMessage = true;
      }

    }, err => {
      this.itemBlockUI.stop();
      this.alertService.showMess(err);
    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }

  async onSubmitLock(id, status, name) {

    let confirmMessage: string;

    if (status == 2) {
      confirmMessage = "Bạn có đồng ý mở khóa " + name + "?";
    } else {
      confirmMessage = "Bạn có đồng ý khóa " + name + "?";
    }

    // if ((await this.alertService.showConfirm(confirmMessage)).value) {
    //   this.userService.lockUser(id, status, "").subscribe(res => {
    //     if (!res.status) {
    //       this.alertService.showError(res.message);
    //       return;
    //     }
    //     this.alertService.showSuccess(res.message);
    //     this.getData();
    //   }, err => {
    //     this.alertService.showError(err);
    //   })
    // }
  }

  getInvenstory(){
    return this.item?.sell_channels ? this.item.sell_channels.map(x=>x.channel.name).join("-") : ""
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

  showJSON(jsonOBj) {
    return JSON.stringify(jsonOBj, null, " ");
  }

}