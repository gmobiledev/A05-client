import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import Swal from 'sweetalert2';
import { GipService } from 'app/auth/service/gip.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-package',
  templateUrl: './package.component.html',
  styleUrls: ['./package.component.scss']
})

export class PackageComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public package: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public currentUser;


  public searchForm = {
    status: '',
    page: 1,
    take: 10,
    skip: 0,
    service_code: '',
    date_range: '',
    topup: ''

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
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.take = params['take'] && params['take'] != undefined ? params['take'] : 10;
      this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : 'AIRTIME_TOPUP';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }

  getData(): void {
    this.gipServer.getPackage().subscribe(res => {
      this.package = res.data;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/package'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/package'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));

    this.contentHeader = {
      headerTitle: 'Danh sách gói cước',
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
            name: 'Danh sách gói cước',
            isLink: false
          }
        ]
      }
    };
  }


}
