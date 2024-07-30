import { SignatureSharedComponent } from './signature/signature.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSoComponent } from './list-so/list-so.component';
import { CoreCommonModule } from '@core/common.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormOrganirationComponent } from './form-organiration/form-organiration.component';
import { FormPersonalComponent } from './form-personal/form-personal.component';
import { OrganizationDocComponent } from './organization-doc/organization-doc.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { NgSelectModule } from '@ng-select/ng-select';
import { InputTagComponent } from './input-tag/input-tag.component';


const routes: Routes = [
  {
    path: 'person',
    component: FormPersonalComponent
  },
  {
    path: 'organiration',
    component: FormOrganirationComponent
  },
]

@NgModule({
  declarations: [
    ListSoComponent,
    SignatureSharedComponent,
    FormOrganirationComponent,
    FormPersonalComponent,
    OrganizationDocComponent,
    InputTagComponent
  ],
  imports: [
    NgbModule,
    CommonModule,
    CoreCommonModule,
    BlockUIModule.forRoot(), FormsModule,
    NgxMaskModule.forRoot(), NgSelectModule
  ],
  exports: [
    ListSoComponent,
    SignatureSharedComponent,
    FormPersonalComponent, FormOrganirationComponent,
    OrganizationDocComponent,InputTagComponent
  ]
})
export class SharedModule { }
