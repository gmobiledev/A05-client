import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-sim-so-checkout-item-gip',
  templateUrl: './sim-so-checkout-item-gip.component.html',
  styleUrls: ['./sim-so-checkout-item-gip.component.scss']
})
export class SimSoCheckoutItemGipComponent implements OnInit {

  @Input() product: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
