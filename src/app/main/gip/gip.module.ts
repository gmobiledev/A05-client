import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListGipComponent } from './list-gip/list-gip.component';
import { ConfigurationInfoComponent } from './configuration-info/configuration-info.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CodeInputModule } from 'angular-code-input';
import { NgbDateCustomParserFormatter } from '../telecom/datepicker-customformat';
import { CallHistoryComponent } from './call-history/call-history.component';
import { ConsumerReportsComponent } from './consumer-reports/consumer-reports.component';
import { InformationManageComponent } from './information-manage/information-manage.component';
import { BusinessInfoComponent } from '../business-info/business-info.component';
import { PackageComponent } from './package/package.component';

const routes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationInfoComponent
  },
  {
    path: 'package',
    component: PackageComponent
  },
  {
    path: 'list',
    component: ListGipComponent
  },
  {
    path: 'call-history',
    component: CallHistoryComponent
  },
  {
    path: 'report',
    component: ConsumerReportsComponent
  },
  {
    path: 'manager',
    component: InformationManageComponent
  },
  {
    path: 'business',
    component: BusinessInfoComponent
  },

];


@NgModule({
  declarations: [
    ListGipComponent,
    ConfigurationInfoComponent,
    CallHistoryComponent,
    ConsumerReportsComponent,
    InformationManageComponent,
    BusinessInfoComponent,
    PackageComponent
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
  ]
})
export class GIPModule { }
