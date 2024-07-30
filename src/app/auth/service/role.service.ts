import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class RoleService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll() {
    return this._http.get<any>(`${environment.apiUrl}/admin/role`);
  }

  getAllPermission() {
    return this._http.get<any>(`${environment.apiUrl}/admin/route/list`)
  }

  getPermissionRole(role: any = '') {
    return this._http.get<any>(`${environment.apiUrl}/admin/role/permission?id=${role}`);
  }

  getByUser(userId) {
    return this._http.get<any>(`${environment.apiUrl}/admin/role/permission/view/${userId}`);
  }

  createRole(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/role`, data)
  }

  deleteRole(role) {
    return this._http.delete<any>(`${environment.apiUrl}/admin/role/${role}`)
  }

  addRouteToRole(role, data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/role/permission/${role}`, data)
  }

  removeRouteFromRole(role, data) {
    return this._http.put<any>(`${environment.apiUrl}/admin/role/permission/${role}`, data)
  }
}
