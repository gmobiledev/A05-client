import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class UnitService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

    getAllUnits(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/unit`, { params });
  }
}