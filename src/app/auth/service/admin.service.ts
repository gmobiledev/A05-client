import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/admin/list`, {params: params});
  }

  getOne(id) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/admin/${id}`);
  } 

  lockUser(id, status, reason) {
    return this._http.post<any>(`${environment.apiUrl}/merchant/admin/lock`, {user_id: id, status: status, reason: reason});
  }

  create(data) {
    return this._http.post<any>(`${environment.apiUrl}/merchant/admin`, data);
  }

  getReports() {
    return this._http.get<any>(`${environment.apiUrl}/merchant/admin/reports`);
  }

  getContries(){
    return this._http.get<any>(`${environment.apiUrl}/area/countries`);
  }
  getProvinces(){
    return this._http.get<any>(`${environment.apiUrl}/area/get-provinces`);
  }
  getDistricts(provinceId: number){
    return this._http.get<any>(`${environment.apiUrl}/area/get-districts/${provinceId}`);
  }
  getCommunes(districtId: number){
    return this._http.get<any>(`${environment.apiUrl}/area/get-communes/${districtId}`);
  }
}
