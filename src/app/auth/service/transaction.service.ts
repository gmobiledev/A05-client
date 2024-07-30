import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class TransactionServivce {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/transaction`, {params: params});
  }

  /**
   * Get user by id
   */
  getAllTransType() {
    return this._http.get<any>(`${environment.apiUrl}/admin/transaction/trans-type`);
  }

  getBlanceFluctuations(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/transaction/balance-fluctuations`, {params: params});
  }

  getAllTrans(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/transaction`, {params: params});
  }


}
