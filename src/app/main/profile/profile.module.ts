import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { BalanceFluctuationsComponent } from './balance-fluctuations/balance-fluctuations.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UserInfoComponent } from './user-info/user-info.component';
import { CodeInputModule } from 'angular-code-input';
import { NgbDateCustomParserFormatter } from '../telecom/datepicker-customformat';
import { NgxMaskModule } from 'ngx-mask';



// routing
const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'balance-fluctuations',
    component: BalanceFluctuationsComponent,
  },
  {
    path: 'user-info',
    component: UserInfoComponent
  }
];

@NgModule({
  declarations: [
    ChangePasswordComponent,
    BalanceFluctuationsComponent,
    UserInfoComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    ContentHeaderModule,
    CodeInputModule,
    NgxMaskModule.forRoot(),
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})
export class ProfileModule {}
