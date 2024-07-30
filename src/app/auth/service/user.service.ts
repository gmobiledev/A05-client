import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  getUserInfo() {
    return this._http.get<any>(`${environment.apiUrl}/user/get-user-info`);
  }

  updateUserInfo(data) {
    return this._http.put<any>(`${environment.apiUrl}/user/update-info`, data);
  }

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users`, { params: params });
  }

  /**
   * Get user by id
   */
  getById(id: any) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/${id}`);
  }

  lockUser(id, status, reason) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/lock`, { user_id: id, status: status, reason: reason });
  }

  getListPeople(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/people`, { params: params });
  }

  getListService(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/user/services`, { params: params });
  }

  getListFiles(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/list-files`, { params: params });
  }

  viewFile(id): Observable<any> {
    return this._http.get(`${environment.apiUrl}/admin/users/view-file/${id}`);
  }

  postFileExcelPeople(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/upload-excel-people`, data);
  }

  exportExcelPeople(): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/users/export-excel-people`, {}, { observe: 'response', responseType: 'blob' });
  }

  exportExcelEkyc(body = {}): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/users/download-file-excel-ekyc`, body, { observe: 'response', responseType: 'blob' });
  }

  listEkycBatch(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/list-ekyc-batch`, { params: params });
  }

  checkEkyc(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/check-partner-ekyc`, data);
  }

  createNewCustomerOCR(body = {}) {
    return this._http.post<any>(`${environment.apiUrl}/customer/create-ocr`, body);
  }
  updateNewCustomer(id: number, body = {}) {
    return this._http.put<any>(`${environment.apiUrl}/customer/new/${id}`, body);
  }
  createCustomer(body = {}) {
    return this._http.post<any>(`${environment.apiUrl}/customer/create`, body).toPromise();
  }
  createTicket(body = {}) {
    return this._http.post<any>(`${environment.apiUrl}/customer/ticket`, body)
  }

  showBanalace(id) {
    return this._http.get<any>(`${environment.apiUrl}/user/balance/${id}`);
  }
  sumitFile(data) {
    return this._http.post<any>(`${environment.apiUrl}/files/upload`, data);
  }

  getService(code) {
    return this._http.get<any>(`${environment.apiUrl}/service/${code}`);
  }

}
