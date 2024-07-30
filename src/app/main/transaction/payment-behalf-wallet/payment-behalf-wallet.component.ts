import { Component, OnInit, Input } from '@angular/core';
import dayjs from 'dayjs';

@Component({
  selector: 'app-payment-behalf-wallet',
  templateUrl: './payment-behalf-wallet.component.html',
  styleUrls: ['./payment-behalf-wallet.component.scss']
})
export class PaymentBehalfWalletComponent implements OnInit {

  @Input() list: any;
  @Input() page: any;
  @Input() pageSize: any;

  constructor() { }

  ngOnInit(): void {
  }

  showSum(amount1, amount2) {
    return parseInt(amount1) + parseInt(amount2);
  }
}
