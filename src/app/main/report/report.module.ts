import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SimSoComponent } from './sim-so/sim-so.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxMaskModule } from 'ngx-mask';

const routes: Routes = [
  {
    path: 'sim-so',
    component: SimSoComponent
  },
]

@NgModule({
  declarations: [
    SimSoComponent
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
  ]
})
export class ReportModule { }
