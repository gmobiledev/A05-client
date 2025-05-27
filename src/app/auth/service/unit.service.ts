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

    getUnitById(id: number) {
    return this._http.get<any>(`${environment.apiUrl}/unit/${id}`);
  }

  createUnit(data: any) {
    return this._http.post(`${environment.apiUrl}/unit/create-unit`, data);
  }

  updateUnit(id: number, data: any) {
    return this._http.put(`${environment.apiUrl}/unit/update-unit/${id}`, data);
  }

  deleteUnit(id: number) {
    return this._http.delete(`${environment.apiUrl}/unit/delete-unit/${id}`);
  }
}