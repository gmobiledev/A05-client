import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public contentHeader: any;
  public dateRange: any;
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

  constructor() { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách giao dịch nạp tiền',
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
            name: 'Danh sách giao dịch nạp tiền',
            isLink: false
          }
        ]
      }
    };
  }

  onSubmitSearch() {

  }

}
