import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sim-so-checkout-item',
  templateUrl: './sim-so-checkout-item.component.html',
  styleUrls: ['./sim-so-checkout-item.component.scss']
})
export class SimSoCheckoutItemComponent implements OnInit {

  @Input() product: any;
  
  constructor() { }

  removeFromCart(item) {

  }

  ngOnInit(): void {
  }

}
