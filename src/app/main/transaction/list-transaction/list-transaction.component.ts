import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { TransactionServivce } from 'app/auth/service/transaction.service';
import { ServiceCode } from 'app/utils/constants';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')

@Component({
  selector: 'app-list-transaction',
  templateUrl: './list-transaction.component.html',
  styleUrls: ['./list-transaction.component.scss']
})
export class ListTransactionComponent implements OnInit {
  
  public contentHeader: any;
  public code: any;
  public list: any;
  public listTransType: any;
  public total: number;
  public sums: any;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {   
    trans_type: '',
    gateway: '',
    date_range: '',
    page: 1,
    take: 15,
    topup: '',
    skip: 0
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],    
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  selectTopup = [
    {
      value: 0, label: 'Tiền vào'
    },
    {
      value: 1, label: 'Tiền ra'
    }
  ];
  currentTransType;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private activedRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private taskService: TaskService,
    private transactionService: TransactionServivce
  ) {

    const data = this.route.snapshot.data;  
    this.currentTransType = data && data.trans_type ? data.trans_type : '';

    // this.activedRoute.params.subscribe(params => {
        // this.code = params && params.code ? params.code : '';
        if(this.currentTransType == ServiceCode.ADD_DATA_BALANCE) {
          this.selectTopup = [
            {
              value: 0, label: 'Mua Data'
            },
            {
              value: 1, label: 'Nạp Data'
            }
          ]
        }
        this.activedRoute.queryParams.subscribe(params => {          
          this.searchForm.trans_type = params['trans_type'] && params['trans_type'] != undefined ? params['trans_type'] : this.currentTransType;
          this.searchForm.gateway = params['gateway'] && params['gateway'] != undefined ? params['gateway'] : '';
          this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
          this.searchForm.topup = params['topup'] && params['topup'] != undefined ? params['topup'] : '';
          this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
          this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
          this.getData();
        })
    // })
    
   }

  ngOnInit(): void {    
    this.contentHeader = {
      headerTitle: 'Danh sách giao dịch',
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
            name: 'Danh sách giao dịch',
            isLink: false
          }
        ]
      }
    };    
    
  }

  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate ?
    this.dateRange.startDate.toISOString().slice(0,10) + '|' + this.dateRange.endDate.toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/transaction/' + this.currentTransType], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/transaction/' + this.currentTransType], { queryParams: this.searchForm})
  }

  getData() {
    this.sectionBlockUI.start();
    this.transactionService.getAllTrans(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
      this.sums = res.data.sum;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
