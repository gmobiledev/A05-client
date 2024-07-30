import { Component, OnInit } from '@angular/core';
import { TransactionServivce } from 'app/auth/service/transaction.service';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-balance-fluctuations',
  templateUrl: './balance-fluctuations.component.html',
  styleUrls: ['./balance-fluctuations.component.scss']
})
export class BalanceFluctuationsComponent implements OnInit {

  public contentHeader: any;
  public dateRange: any;
  public list: any;
  public listTransType: any;
  public total: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    status: '',
    order_id: '',
    order_id_merchant: '',
    service: '',
    date_range: '',
  }
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],    
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private transactionService: TransactionServivce
  ) { 
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Biến động số dư',
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
            name: 'Biến động số dư',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmitSearch() {

  }

  getData() {
    this.sectionBlockUI.start();
    this.transactionService.getBlanceFluctuations(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
