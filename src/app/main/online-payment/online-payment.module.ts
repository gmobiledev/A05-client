import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayQRComponent } from './pay-qr/pay-qr.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { ShowQrComponent } from './show-qr/show-qr.component';

// routing
const routes: Routes = [
  {
    path: 'qr',
    component: PayQRComponent
  },
  {
    path: 'info-qr',
    component: ShowQrComponent
  },
];

@NgModule({
  declarations: [
    PayQRComponent,
    ShowQrComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxMaskModule.forRoot(),
  ]
})
export class OnlinePaymentModule { }
