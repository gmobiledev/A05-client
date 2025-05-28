import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitsComponent } from './units.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { UnitNodeComponent } from './unit-node/unit-node.component';

const routes: Routes = [
  { path: '', component: UnitsComponent },
];

@NgModule({
  declarations: [UnitsComponent, UnitNodeComponent],
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
    NgSelectModule,
  ],
})
export class UnitsModule {}
