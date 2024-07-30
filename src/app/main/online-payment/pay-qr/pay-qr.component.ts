import { Component, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
@Component({
  selector: 'app-pay-qr',
  templateUrl: './pay-qr.component.html',
  styleUrls: ['./pay-qr.component.scss']
})
export class PayQRComponent implements OnInit {

  public contentHeader: any;
  public coreConfig: any;

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _coreConfigService: CoreConfigService,
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Payment',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Online-Payment',
            isLink: false
          }
        ]
      }
    };

    this._coreConfigService.config = {
      layout: {
        type: "horizontal",
        animation: 'none',
        navbar: {
          hidden: false
        },
        menu: {
          hidden: true
        },
        footer: {
          hidden: false,
          scrollTop: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
  }

  ngAfterViewInit() {
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
  }

}
