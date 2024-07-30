import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { DepositComponent } from './deposit/deposit.component';
import { PaymentComponent } from './payment/payment.component';
import { PaymentBehalfWalletComponent } from './payment-behalf-wallet/payment-behalf-wallet.component';
import { PaymentBehalfBankComponent } from './payment-behalf-bank/payment-behalf-bank.component';
import { TranslateModule } from '@ngx-translate/core';
import { ServiceCode } from 'app/utils/constants';

const routes: Routes = [
  {
    path: '',
    component: ListTransactionComponent
  },
  // {
  //   path: ':code',
  //   component: ListTransactionComponent
  // },
  {
    path: ServiceCode.ADD_DATA_BALANCE,
    data: {
      trans_type: ServiceCode.ADD_DATA_BALANCE
    },
    component: ListTransactionComponent
  },
  {
    path: ServiceCode.ADD_MONEY_BALANCE,
    data: {
      trans_type: ServiceCode.ADD_MONEY_BALANCE
    },
    component: ListTransactionComponent
  },
  {
    path: 'deposit',
    component: DepositComponent
  },
  {
    path: 'payment-behalf-wallet',
    component: PaymentBehalfWalletComponent
  },
  {
    path: 'payment-behalf-bank',
    component: PaymentBehalfBankComponent
  },
  {
    path: 'payment',
    component: PaymentComponent
  },
];

@NgModule({
  declarations: [
    ListTransactionComponent,
    DepositComponent,
    PaymentComponent,
    PaymentBehalfWalletComponent,
    PaymentBehalfBankComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ]
})
export class TransactionModule { }
