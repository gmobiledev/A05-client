import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class PackagesService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  getAll(params: any = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/package`, {params: params});
  }

}
