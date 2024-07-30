
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { GipService } from 'app/auth/service/gip.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-list-gip',
  templateUrl: './list-gip.component.html',
  styleUrls: ['./list-gip.component.scss']
})
export class ListGipComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;


  public listServices: any;
  public modalRef: any;
  public selectedItem: any;
  public currentUser;


  public searchForm = {
    msisdn : '',
    state : '',
    page_size : 0,
    page : 20,
  }

  public dataExcel = {
    "service_code": "AIRTIME_TOPUP",
    "is_task_account_root": false
  }

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }



  constructor(
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private gipService: GipService,


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.state = params['state'] && params['state'] != undefined ? params['state'] : '';
      // this.searchForm.page_size = params['page_size'] && params['page_size'] != undefined ? params['page_size'] : 0;
      // this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 20;
      this.searchForm.msisdn = params['msisdn'] && params['msisdn'] != undefined ? params['msisdn'] : '';

      this.getData();
    })
  }



  getData(): void {
    this.gipService.getAllSub(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }


  modalOpen(modal, item = null) {
    this.userService.getListService().subscribe(res => {
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      this.listServices = res.data;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    })

  }

  modalClose() {
    this.selectedItem = null;
    this.modalRef.close();
  }


  async onSubmitLock(note) {

    const confirmMessage = status ? "Bạn có đồng ý Đóng thuê bao" : "Bạn có đồng ý Mở thuê bao?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gipService.lockGip("lock_subcriber", "0598292068", note).subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/list'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/list'], { queryParams: this.searchForm })
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    // this.searchForm.date_range = daterangeString;

    this.gipService.exportData(this.dataExcel).subscribe(res => {
      console.log(res.body.type)
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo Airtime";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })

  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.contentHeader = {
      headerTitle: 'Danh sách thuê bao',
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
            name: 'Danh sách thuê bao',
            isLink: false
          }
        ]
      }
    };
  }



}

