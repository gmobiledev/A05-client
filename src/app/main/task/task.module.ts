import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task/task.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { ServiceCode } from 'app/utils/constants';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskSearchComponent } from './task-search/task-search.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TaskRechargeComponent } from './task-recharge/task-recharge.component';

// routing
const routes: Routes = [
  {
    path: 'sim',
    data: {
      service: ServiceCode.SIM_PROFILE
    },
    component: TaskComponent
  },
  {
    path: 'kitting',
    data: {
      service: ServiceCode.SIM_KITTING
    },
    component: TaskComponent
  },
  {
    path: 'search',
    component: TaskSearchComponent
  },
  {
    path: 'recharge',
    component: TaskRechargeComponent
  },
  {
    path: 'sim-register',
    data: {
      service: ServiceCode.SIM_REGISTER
    },
    component: TaskComponent
  },
  {
    path: 'buy-data',
    data: {
      service: ServiceCode.BUY_DATA
    },
    component: TaskComponent
  },
  {
    path: 'balance',
    data: {
      service: ServiceCode.ADD_MONEY_BALANCE
    },
    component: TaskComponent
  },
  {
    path: 'data',
    data: {
      service: ServiceCode.ADD_DATA_BALANCE
    },
    component: TaskComponent
  },
  {
    path: 'add-mobile-package',
    data: {
      service: ServiceCode.ADD_MOBILE_PACKAGE
    },
    component: TaskComponent
  },
  {
    path: 'sim-bundle',
    data: {
      service: ServiceCode.SIM_BUNDLE
    },
    component: TaskComponent
  },
  {
    path: ':id',
    component: TaskDetailComponent
  },  
];

@NgModule({
  declarations: [
    TaskComponent,
    TaskDetailComponent,
    TaskSearchComponent,
    TaskRechargeComponent
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
    NgxDaterangepickerMd.forRoot(),
  ],
  providers: []
})
export class TaskModule { }
