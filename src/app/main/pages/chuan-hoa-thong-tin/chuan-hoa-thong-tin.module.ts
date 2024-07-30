import { CodeInputModule } from 'angular-code-input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyMobileComponent } from './verify-mobile/verify-mobile.component';
import { UploadIdentityDocComponent } from './upload-identity-doc/upload-identity-doc.component';
import { ConfirmIdentityInfoComponent } from './confirm-identity-info/confirm-identity-info.component';
import { ConfirmPycComponent } from './confirm-pyc/confirm-pyc.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';
import { CoreCardModule } from '@core/components/core-card/core-card.module';
import { CoreDirectivesModule } from '@core/directives/directives';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ModalsModule } from 'app/main/components/modals/modals.module';
import { SharedModule } from 'app/shared/shared.module';
import { BlockUIModule } from 'ng-block-ui';
import { FileUploadModule } from 'ng2-file-upload';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaskModule } from 'ngx-mask';
import { WebcamModule } from 'ngx-webcam';
import { TagInputModule } from 'ngx-chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgbDateCustomParserFormatter } from 'app/main/telecom/datepicker-customformat';
import { SubmitSuccessComponent } from './submit-success/submit-success.component';
const routes: Routes = [
  {
    path: 'xac-nhan-mobile',
    component: VerifyMobileComponent
  },
  {
    path: 'tai-anh-giay-to',
    component: UploadIdentityDocComponent
  },
  {
    path: 'xac-nhan-thong-tin',
    component: ConfirmIdentityInfoComponent
  },
  {
    path: 'ky-xac-nhan',
    component: ConfirmPycComponent
  },
  {
    path: 'hoan-thanh',
    component: SubmitSuccessComponent
  }
];
@NgModule({
  declarations: [
    VerifyMobileComponent,
    UploadIdentityDocComponent,
    ConfirmIdentityInfoComponent,
    ConfirmPycComponent,
    SubmitSuccessComponent
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
    BlockUIModule.forRoot(),
    NgxExtendedPdfViewerModule,
    CoreCardModule,
    ImageCropperModule,
    NgxMaskModule.forRoot(),
    PdfViewerModule,
    ModalsModule,
    CodeInputModule,
    TagInputModule
  ],
  providers: [
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
   ]
})
export class ChuanHoaThongTinModule {

}
  
