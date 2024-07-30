import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import { GipService } from 'app/auth/service/gip.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.scss']
})

export class CallHistoryComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public currentUser;


  public searchForm = {
    msisdn : '',
    start_date : '',
    end_date : '',
    page_size : 20,
    page : 1,
    type : '',

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
    private route: ActivatedRoute,
    private router: Router,
    private gipServer: GipService


  ) {
    this.route.queryParams.subscribe(params => {
      // this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      // this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      // this.searchForm.take = params['take'] && params['take'] != undefined ? params['take'] : 10;
      // this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.searchForm.type = params['type'] && params['type'] != undefined ? params['type'] : 'call';
      this.searchForm.msisdn = params['msisdn'] && params['msisdn'] != undefined ? params['msisdn'] : '';


      this.getData();
    })
  }

  // public dataCall = {
  //   merchant_id: 1050,
  //   msisdn: '',
  //   start_date: '2023-11-01',
  //   end_date: '2023-11-30',
  //   page_size: 10,
  //   page: 1,
  //   type: 'call'
  // };



  getData(): void {
    this.gipServer.getAllCall(this.searchForm).subscribe(res => {
      this.list = res.data;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));

    this.contentHeader = {
      headerTitle: 'Lịch sử cuộc gọi',
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
            name: 'Lịch sử cuộc gọi',
            isLink: false
          }
        ]
      }
    };
  }


}
