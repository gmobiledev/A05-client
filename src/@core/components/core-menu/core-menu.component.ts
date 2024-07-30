import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CoreMenuService } from '@core/components/core-menu/core-menu.service';

@Component({
  selector: '[core-menu]',
  templateUrl: './core-menu.component.html',
  styleUrls: ['./core-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreMenuComponent implements OnInit {
  currentUser: any;

  @Input()
  layout = 'vertical';

  @Input()
  menu: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   *
   * @param {ChangeDetectorRef} _changeDetectorRef
   * @param {CoreMenuService} _coreMenuService
   */
  constructor(private _changeDetectorRef: ChangeDetectorRef, private _coreMenuService: CoreMenuService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
    this.initMenu();
  }

  // Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Set the menu either from the input or from the service
    
  }

  initMenu() {
    this.menu = this.menu || this._coreMenuService.getCurrentMenu();
    this.currentUser = this._coreMenuService.currentUser;
    console.log("CURREENT_MENU");
      console.log(this.menu);
    // Subscribe to the current menu changes
    // this._coreMenuService.onMenuChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
    //   this.currentUser = this._coreMenuService.currentUser;

    //   // Load menu
    //   this.menu = this._coreMenuService.getCurrentMenu();

    //   console.log("CURREENT_MENU");
    //   console.log(this.menu);

    //   this._changeDetectorRef.markForCheck();
    // });
  }

  checkMenu(item) {
    return this.currentUser.roles && this.currentUser.roles.filter(el => item.role.includes(el)).length > 0 ? true : false
  }
}
