import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListUserComponent } from './list-user/list-user.component';
import { BlockUIModule } from 'ng-block-ui';


// routing
const routes: Routes = [
  {
    path: 'list',
    component: ListUserComponent
  },
];

@NgModule({
  declarations: [
    ListUserComponent,
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
    BlockUIModule.forRoot()
  ],
  providers: []
})
export class UserModule {}
