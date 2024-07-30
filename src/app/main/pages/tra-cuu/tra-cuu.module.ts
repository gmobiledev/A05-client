import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TraCuuComponent } from './tra-cuu.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { RECAPTCHA_LANGUAGE, RECAPTCHA_SETTINGS, RECAPTCHA_V3_SITE_KEY, RecaptchaModule, RecaptchaSettings } from "ng-recaptcha";


const routes: Routes = [
  {
    path: '',
    component: TraCuuComponent
  },
];


@NgModule({
  declarations: [
    TraCuuComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot(),
    RecaptchaModule
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: "6LfTesInAAAAABXzUvTDjUlpUaMDs9eJL0e8ysFN",
      } as RecaptchaSettings,
    },
    {
      provide: RECAPTCHA_LANGUAGE,
      useValue: "vi",
    }
  ],
})
export class TraCuuModule { }
