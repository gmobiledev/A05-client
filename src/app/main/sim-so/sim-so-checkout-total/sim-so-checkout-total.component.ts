import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sim-so-checkout-total',
  templateUrl: './sim-so-checkout-total.component.html',
  styleUrls: ['./sim-so-checkout-total.component.scss']
})
export class SimSoCheckoutTotalComponent implements OnInit {

  @Input() totalPhihoamang: number;
  @Input() totalCuoc: number;
  @Input() totalPrice: number;

  constructor() { }

  ngOnInit(): void {

  }

}
