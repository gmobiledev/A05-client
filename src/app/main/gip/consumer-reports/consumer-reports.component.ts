import { Component, OnInit } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';
import { GipService } from 'app/auth/service/gip.service';
import { AuthenticationService, UserService } from 'app/auth/service';
import { TransactionServivce } from 'app/auth/service/transaction.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-consumer-reports',
  templateUrl: './consumer-reports.component.html',
  styleUrls: ['./consumer-reports.component.scss']
})


export class ConsumerReportsComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any;

  public listIn: any;
  public listOut: any;
  public isViewFile: boolean = false;
  public urlFile: any;

  public total: number;
  public page: number = 1;
  public pageSize: number;


  public loading = false;

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public searchForm = {
    msisdn: '0973583328',
    page_size: 20,
    page: 1,
    
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private gipService: GipService
  ) {

    this.route.queryParams.subscribe(params => {
      this.route.data.subscribe(data => {
        console.log(data);
      });
      this.getData();

    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Báo cáo tiêu dùng',
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
            name: 'Báo cáo tiêu dùng',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/report'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/report'], { queryParams: this.searchForm });
  }

  getData() {
    this.sectionBlockUI.start();
    this.gipService.getReport(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listIn = res.data;

      // this.total = res.data.count;
      // this.pageSize = res.data.pageSize;

    })


  }

}
