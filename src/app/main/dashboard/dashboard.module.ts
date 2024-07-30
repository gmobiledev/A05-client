import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AuthGuard } from 'app/auth/helpers';
import { Role } from 'app/auth/models';

import { CoreCommonModule } from '@core/common.module';

import { InvoiceModule } from 'app/main/apps/invoice/invoice.module';
import { ReportsComponent } from './reports/reports.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'reports',
    component: ReportsComponent
  },
  {
    path: 'home',
    component: HomeComponent
  }
];

@NgModule({
  declarations: [ReportsComponent, HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    NgbModule,
    PerfectScrollbarModule,
    ContentHeaderModule,
    CoreCommonModule,
    NgApexchartsModule,
    InvoiceModule
  ],
  providers: [],
  exports: []
})
export class DashboardModule {}
