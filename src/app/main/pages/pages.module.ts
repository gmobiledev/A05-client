import { ConfirmIdentityInfoComponent } from './chuan-hoa-thong-tin/confirm-identity-info/confirm-identity-info.component';
import { VerifyMobileComponent } from './chuan-hoa-thong-tin/verify-mobile/verify-mobile.component';
import { ComponentFactoryResolver, Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UploadIdentityDocComponent } from './chuan-hoa-thong-tin/upload-identity-doc/upload-identity-doc.component';
import { ConfirmPycComponent } from './chuan-hoa-thong-tin/confirm-pyc/confirm-pyc.component';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { NgbModalConfig, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TraCuuComponent } from './tra-cuu/tra-cuu.component';

const appRoutes: Routes = [
  {
    path: 'chuan-hoa-thong-tin',
    loadChildren: () => import('./chuan-hoa-thong-tin/chuan-hoa-thong-tin.module').then(m => m.ChuanHoaThongTinModule)
  },
  { path: 'xac-nhan-mobile', component: VerifyMobileComponent },
  { path: 'tai-anh-giay-to', component: UploadIdentityDocComponent },
  { path: 'xac-nhan-thong-tin', component: ConfirmIdentityInfoComponent },
  { path: 'ky-xac-nhan', component: ConfirmPycComponent },
  {
    path: 'tra-cuu',
    loadChildren: () => import('./tra-cuu/tra-cuu.module').then(m => m.TraCuuModule),
  },

]

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(appRoutes)
  ]
})
export class PagesModule {

}
export declare class NgbModal {
  private _moduleCFR;
  private _injector;
  private _modalStack;
  private _config;
  constructor(_moduleCFR: ComponentFactoryResolver, _injector: Injector, _modalStack: NgbModalStack, _config: NgbModalConfig);
  /**
   * Opens a new modal window with the specified content and supplied options.
   *
   * Content can be provided as a `TemplateRef` or a component type. If you pass a component type as content,
   * then instances of those components can be injected with an instance of the `NgbActiveModal` class. You can then
   * use `NgbActiveModal` methods to close / dismiss modals from "inside" of your component.
   *
   * Also see the [`NgbModalOptions`](#/components/modal/api#NgbModalOptions) for the list of supported options.
   */
  open(content: any, options?: NgbModalOptions): NgbModalRef;
  /**
   * Returns an observable that holds the active modal instances.
   */
  get activeInstances(): import("@angular/core").EventEmitter<NgbModalRef[]>;
  /**
   * Dismisses all currently displayed modal windows with the supplied reason.
   *
   * @since 3.1.0
   */
  dismissAll(reason?: any): void;
  /**
   * Indicates if there are currently any open modal windows in the application.
   *
   * @since 3.3.0
   */
}

//# sourceMappingURL=modal.d.ts.map