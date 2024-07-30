import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListServiceComponent } from './list-service/list-service.component';
import { ViewServiceComponent } from './view-service/view-service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';

// routing
const routes: Routes = [
  {
    path: 'list',
    component: ListServiceComponent
  },
  {
    path: ':id',
    component: ViewServiceComponent
  }
];

@NgModule({
  declarations: [
    ListServiceComponent,
    ViewServiceComponent
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

  ],
  providers: []
})
export class PaymentModule { }
