import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EInvoiceComponent } from './e-invoice/e-invoice.component';
import { SmsOtpComponent } from './sms-otp/sms-otp.component';
import { VoiceOtpComponent } from './voice-otp/voice-otp.component';
import { VideoKycComponent } from './video-kyc/video-kyc.component';
import { Routes, RouterModule } from '@angular/router';
import { BlockUIModule } from 'ng-block-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AirtimeComponent } from './airtime/airtime.component';
import { GipComponent } from './gip/gip.component';
import { ServiceCode } from 'app/utils/constants';
import { DetailServiceComponent } from './detail-service/detail-service.component';


const routes: Routes = [
  {
    path: 'voice',
    component: VoiceOtpComponent
  },
  {
    path: 'video',
    component: VideoKycComponent
  },
  {
    path: 'sms',
    component: SmsOtpComponent
  },

  {
    path: 'invoice',
    component: EInvoiceComponent
  },

  {
    path: 'airtime',
    component: AirtimeComponent
  },

  {
    path: 'gip',
    component: GipComponent
  },


  {
    path: 'balance',
    data: {
      service: ServiceCode.ADD_MONEY_BALANCE
    },
    component: DetailServiceComponent
  },
  {
    path: 'data',
    data: {
      service: ServiceCode.ADD_DATA_BALANCE
    },
    component: DetailServiceComponent
  },

];

@NgModule({
  declarations: [
    VideoKycComponent,
    SmsOtpComponent,
    VoiceOtpComponent,
    EInvoiceComponent,
    AirtimeComponent,
    GipComponent,
    DetailServiceComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    NgApexchartsModule

  ]
})
export class ServicesModule { }
