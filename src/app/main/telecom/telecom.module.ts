import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewSimComponent } from './new-sim/new-sim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedModule } from 'app/shared/shared.module';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ChangeSimComponent } from './change-sim/change-sim.component';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { WebcamModule } from 'ngx-webcam';
import { FileUploadModule } from 'ng2-file-upload';
import { CartComponent } from './new-sim/cart/cart.component';
import { IdentityDocComponent } from './new-sim/identity-doc/identity-doc.component';
import { IdentityInfoComponent } from './new-sim/identity-info/identity-info.component';
import { ListNumberComponent } from './new-sim/list-number/list-number.component';
import { PackagesComponent } from './new-sim/packages/packages.component';
import { PycContractComponent } from './new-sim/pyc-contract/pyc-contract.component';
import { SelfieComponent } from './new-sim/selfie/selfie.component';
import { SerialSimComponent } from './new-sim/serial-sim/serial-sim.component';
import { SignatureComponent } from './new-sim/signature/signature.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TelecomTaskComponent } from './telecom-task/telecom-task.component';
import { BlockUIModule } from 'ng-block-ui';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { NouisliderModule } from 'ng2-nouislider';
import { SignatureChangeSimComponent } from './change-sim/signature/signature.component';
import { CoreCardModule } from '@core/components/core-card/core-card.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaskModule } from 'ngx-mask';
import { ModalsModule } from '../components/modals/modals.module';
import { NgbDateCustomParserFormatter } from './datepicker-customformat';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrganizationDocComponent } from './new-sim/organization-doc/organization-doc.component';
import { OrganizationAssignComponent } from './new-sim/organization-assign/organization-assign.component';
import { PeopleComponent } from './forms/form-people/people.component';
import { FormOrganirationComponent } from './forms/form-organiration/form-organiration.component';
import { OrganizationComponent } from './new-sim/organization/organization.component';
import { GSubService } from 'app/auth/service/gsub.service';
import { UpdateSubscriptionComponent } from './update-subscription/update-subscription.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: TelecomTaskComponent
  },
  {
    path: 'new-sim/organization',
    component: OrganizationComponent
  },
  {
    path: 'new-sim',
    component: NewSimComponent
  },
  {
    path: 'change-sim',
    component: ChangeSimComponent
  },

  {
    path: 'update',
    component: UpdateSubscriptionComponent
  },


];

@NgModule({
  declarations: [
    NewSimComponent,
    ChangeSimComponent,
    NewSimComponent,
    ListNumberComponent,
    PackagesComponent,
    SerialSimComponent,
    CartComponent,
    IdentityDocComponent,
    IdentityInfoComponent,
    SelfieComponent,
    PycContractComponent,
    SignatureComponent,
    TelecomTaskComponent,
    SignatureChangeSimComponent,
    OrganizationDocComponent,
    OrganizationAssignComponent,
    PeopleComponent,
    FormOrganirationComponent,
    OrganizationComponent,
    UpdateSubscriptionComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDaterangepickerMd.forRoot(),
    ContentHeaderModule,
    CoreDirectivesModule,
    CoreCommonModule,
    SharedModule,
    CardSnippetModule,
    FileUploadModule,
    WebcamModule,
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot(),
    NgxExtendedPdfViewerModule,
    CoreCardModule,
    ImageCropperModule,
    PdfViewerModule,
    ModalsModule, NgSelectModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    GSubService
  ]
})
export class TelecomModule { }
