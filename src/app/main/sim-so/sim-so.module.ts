import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuySoComponent } from './buy-so/buy-so.component';
import {  ListSoComponent } from './list-so/list-so.component';
import { LogCallComponent } from './log-call/log-call.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedModule } from 'app/shared/shared.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CoreCommonModule } from '@core/common.module';
import { SimSoCheckoutItemComponent } from './sim-so-checkout-item/sim-so-checkout-item.component';
import { SimSoCheckoutTotalComponent } from './sim-so-checkout-total/sim-so-checkout-total.component';
import { SimSoCheckoutItemGipComponent } from './sim-so-checkout-item-gip/sim-so-checkout-item-gip.component';

const routes: Routes = [
  {
    path: 'list',
    component: ListSoComponent
  },
  {
    path: 'buy',
    component: BuySoComponent,
  },
  {
    path: 'log-call',
    component: LogCallComponent
  }
];

@NgModule({
  declarations: [
    BuySoComponent,
    ListSoComponent,
    LogCallComponent,
    SimSoCheckoutItemComponent,
    SimSoCheckoutTotalComponent,
    SimSoCheckoutItemGipComponent,
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule,
    ReactiveFormsModule,    
    NgxDaterangepickerMd.forRoot(),
    ContentHeaderModule,
    CoreDirectivesModule,
    CoreCommonModule,
    SharedModule
  ]
})
export class SimSoModule { }
