import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { FakeDbService } from '@fake-db/fake-db.service';

import 'hammerjs';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { ContextMenuModule } from '@ctrl/ngx-rightclick';

import { CoreModule } from '@core/core.module';
import { CoreCommonModule } from '@core/common.module';
import { CoreSidebarModule, CoreThemeCustomizerModule } from '@core/components';
import { CardSnippetModule } from '@core/components/card-snippet/card-snippet.module';

import { coreConfig } from 'app/app-config';
import { AuthGuard } from 'app/auth/helpers/auth.guards';
import { JwtInterceptor, ErrorInterceptor } from 'app/auth/helpers';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';

import { ContextMenuComponent } from 'app/main/extensions/context-menu/context-menu.component';
import { AnimatedCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/animated-custom-context-menu/animated-custom-context-menu.component';
import { BasicCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/basic-custom-context-menu/basic-custom-context-menu.component';
import { SubMenuCustomContextMenuComponent } from './main/extensions/context-menu/custom-context-menu/sub-menu-custom-context-menu/sub-menu-custom-context-menu.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BlockUIModule } from 'ng-block-ui';
import { ServiceWorkerModule } from '@angular/service-worker';

const appRoutes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./main/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./main/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'sim-so',
    loadChildren: () => import('./main/sim-so/sim-so.module').then(m => m.SimSoModule),
    // canActivate: [AuthGuard]
  },

  {
    path: 'user',
    loadChildren: () => import('./main/user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'telecom',
    loadChildren: () => import('./main/telecom/telecom.module').then(m => m.TelecomModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'payment',
    loadChildren: () => import('./main/payment/payment.module').then(m => m.PaymentModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'online-payment',
    loadChildren: () => import('./main/online-payment/online-payment.module').then(m => m.OnlinePaymentModule),
  },
  {
    path: 'task',
    loadChildren: () => import('./main/task/task.module').then(m => m.TaskModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'gip',
    loadChildren: () => import('./main/gip/gip.module').then(m => m.GIPModule),
    canActivate: [AuthGuard]
  },


  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
  },

  {
    path: 'transaction',
    loadChildren: () => import('./main/transaction/transaction.module').then(m => m.TransactionModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'services',
    loadChildren: () => import('./main/services/services.module').then(m => m.ServicesModule),
    canActivate: [AuthGuard]
  },

  
  {
    path: 'dashboard',
    loadChildren: () => import('./main/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'report',
    loadChildren: () => import('./main/report/report.module').then(m => m.ReportModule),
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'apps',
  //   loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule),
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'ui',
  //   loadChildren: () => import('./main/ui/ui.module').then(m => m.UIModule),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'components',
    loadChildren: () => import('./main/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'extensions',
    loadChildren: () => import('./main/extensions/extensions.module').then(m => m.ExtensionsModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'forms',
    loadChildren: () => import('./main/forms/forms.module').then(m => m.FormsModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/pages/miscellaneous/error' //Error 404 - Page not found
  }
];

@NgModule({
  declarations: [
    AppComponent,
    ContextMenuComponent,
    BasicCustomContextMenuComponent,
    AnimatedCustomContextMenuComponent,
    SubMenuCustomContextMenuComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(FakeDbService, {
      delay: 0,
      passThruUnknownUrl: true
    }),
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      relativeLinkResolution: 'legacy'
    }),
    NgbModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot(),
    ContextMenuModule,
    CoreModule.forRoot(coreConfig),
    CoreCommonModule,
    CoreSidebarModule,
    CoreThemeCustomizerModule,
    CardSnippetModule,
    LayoutModule,
    ContentHeaderModule,
    NgxDaterangepickerMd.forRoot(),
    BlockUIModule.forRoot(),
    ServiceWorkerModule.register('/firebase-messaging-sw.js', { enabled: true }),
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // ! IMPORTANT: Provider used to create fake backend, comment while using real API
    // fakeBackendProvider
  ],
  entryComponents: [BasicCustomContextMenuComponent, AnimatedCustomContextMenuComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
