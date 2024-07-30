import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AuthenticationService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoreMenuService {
  currentUser: User;
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;

  // Private
  private _onMenuRegistered: BehaviorSubject<any>;
  private _onMenuUnregistered: BehaviorSubject<any>;
  private _onMenuChanged: BehaviorSubject<any>;
  private _currentMenuKey: string;
  private _registry: { [key: string]: any } = {};

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthenticationService} _authenticationService
   */
  constructor(
    private _router: Router, 
    private _authenticationService: AuthenticationService,
    private _http: HttpClient
    ) {
    this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));

    // Set defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();

    // Set private defaults
    this._currentMenuKey = null;
    this._onMenuRegistered = new BehaviorSubject(null);
    this._onMenuUnregistered = new BehaviorSubject(null);
    this._onMenuChanged = new BehaviorSubject(null);
  }

  // Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * onMenuRegistered
   *
   * @returns {Observable<any>}
   */
  get onMenuRegistered(): Observable<any> {
    return this._onMenuRegistered.asObservable();
  }

  /**
   * onMenuUnregistered
   *
   * @returns {Observable<any>}
   */
  get onMenuUnregistered(): Observable<any> {
    return this._onMenuUnregistered.asObservable();
  }

  /**
   * onMenuChanged
   *
   * @returns {Observable<any>}
   */
  get onMenuChanged(): Observable<any> {
    return this._onMenuChanged.asObservable();
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Register the provided menu with the provided key
   *
   * @param key
   * @param menu
   */
  register(key, menu): void {
    // Confirm if the key already used
    if (this._registry[key]) {
      console.error(`Menu with the key '${key}' already exists. Either unregister it first or use a unique key.`);

      return;
    }

    // Add to registry
    this._registry[key] = menu;

    // Notify subject
    this._onMenuRegistered.next([key, menu]);
  }

  /**
   * Unregister the menu from the registry
   *
   * @param key
   */
  unregister(key): void {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);
    }

    // Unregister sidebar
    delete this._registry[key];

    // Notify subject
    this._onMenuUnregistered.next(key);
  }

  /**
   * Get menu from registry by key
   *
   * @param key
   * @returns {any}
   */
  getMenu(key): any {
    // Confirm if the menu exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Return sidebar
    return this._registry[key];
  }

  /**
   * Get current menu
   *
   * @returns {any}
   */
  getCurrentMenu(): any {
    if (!this._currentMenuKey) {
      console.warn(`The current menu is not set.`);

      return;
    }

    return this.getMenu(this._currentMenuKey);
  }

  /**
   * Set menu with the key as the current menu
   *
   * @param key
   */
  setCurrentMenu(key): void {
    // Confirm if the sidebar exists
    if (!this._registry[key]) {
      console.warn(`Menu with the key '${key}' doesn't exist in the registry.`);

      return;
    }

    // Set current menu key
    this._currentMenuKey = key;

    // Notify subject
    this._onMenuChanged.next(key);
  }

  async getListMenuService(key) {
    const token = this.currentUser.token;
    if(localStorage.getItem("menu_services") !== null && localStorage.getItem("menu_others")) {
      const menuService = JSON.parse(localStorage.getItem("menu_services"));
      const menuOthers = JSON.parse(localStorage.getItem("menu_others"));
      this._registry[key].push(menuService);
      this._registry[key].push(menuOthers);
  
      this._onMenuRegistered.next([key, menuService]);
      this._onMenuRegistered.next([key, menuOthers]);
    } else {
      if(token) {
        const res = await this.httpGetMenu(token);
          const listService = res.data;
          let listChildMenu = [];
          for(let i = 0;i<listService.length; i++) {
            const item = listService[i];
            listChildMenu.push(
              {
                id: item.service.code,
                title: item.service.desc,
                translate: '',
                type: 'item',
                icon: 'list',
                url: `transaction/${item.service.code}`      
              },
            )
          }
          
          const menuService = 
            {
              id: 'transaction-management',
              type: 'section',
              title: 'Quản lý giao dịch',
              translate: 'MENU.TRANSACTION_MANAGEMENT',
              icon: 'package',
              children: listChildMenu
            };
  
          const menuOthers =  {
              id: 'Other',
              type: 'section',
              title: 'Khác',
              translate: 'MENU.OTHERS.SECTION',
              icon: 'package',
              children: [
                {
                  id: '',
                  title: 'Thông tin tài khoản',
                  translate: '',
                  type: 'item',
                  icon: 'info',
                  url: 'profile/account-info' 
                }
              ]
            }
  
          localStorage.setItem("menu_services", JSON.stringify(menuService));
          localStorage.setItem("menu_others", JSON.stringify(menuOthers));
  
          this._registry[key].push(menuService);
          this._registry[key].push(menuOthers);
  
          this._onMenuRegistered.next([key, menuService]);
          this._onMenuRegistered.next([key, menuOthers]);
      }
    }
    
  }

  httpGetMenu(token) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/service`, {headers: {Authorization: `Bearer ${token}`}}).toPromise();
  }
}
