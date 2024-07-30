import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-payment-behalf-bank',
  templateUrl: './payment-behalf-bank.component.html',
  styleUrls: ['./payment-behalf-bank.component.scss']
})
export class PaymentBehalfBankComponent implements OnInit {

  public contentHeader: any;
  public dateRange: any;
  public searchForm = {
    user: '',
    status: '',
    order_id: '',
    order_id_merchant: '',
    trans_type: '',
    gateway: '',
    date_range: '',
    bank: '',
  }
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],    
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách chi hộ bank',
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
            name: 'Danh sách chi hộ bank',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmitSearch() {

  }

}
