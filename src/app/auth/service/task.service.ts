import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { AddBalanceServiceDto } from './dto/add-balance-service.dto';

@Injectable({ providedIn: 'root' })
export class TaskService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all users
   */
  getAll(code, params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/merchant/task/${code}`, { params: params });
  }

  getAllTask(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/task`, { params: params });
  }

  getCreateTask(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/payment`, data);
  }

  updateTaskPayment(id, data) {
    return this._http.put<any>(`${environment.apiUrl}/task/payment/${id}`, data);
  }

  showPrice(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/calculate-price`, data);
  }

  comfirmPayment(id, data) {
    return this._http.post<any>(`${environment.apiUrl}/task/payment/${id}/confirm`, data);
  }

  getTaskDetail(id) {
    return this._http.get<any>(`${environment.apiUrl}/task/${id}`);
  }

  getTaskDelete(id) {
    return this._http.delete<any>(`${environment.apiUrl}/task/payment/${id}`);
  }

  getAllService() {
    return this._http.get<any>(`${environment.apiUrl}/merchant/service`);
  }

  getAllLoan(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/loan-bank`, { params: params });
  }

  orderSIMProfile(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/sim-profile`, data);
  }

  comfirmTask(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/confirm`, data);
  }

  uploadSerial(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/upload-serial`, data);
  }

  addBalance(data: AddBalanceServiceDto) {
    return this._http.post<any>(`${environment.apiUrl}/task/add-balance`, data);
  }

  createKitting(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/create-kitting-order`, data);
  }

  createKittingEsim(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/create-kitting-esim-order`, data);
  }

  createSimRegister(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/create-sim-register-order`, data);
  }

  updateSimProfile(id, data) {
    return this._http.put<any>(`${environment.apiUrl}/task/sim-profile/${id}`, data);
  }

  createBundle(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/create-bundle`, data);
  }

  getReportTelecom(params) {
    return this._http.get<any>(`${environment.apiUrl}/task/telecom/report`, { params: params });
  }

  retryTask(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/retry`, data);
  }

  updateStateRetry(id, data = null) {
    return this._http.patch<any>(`${environment.apiUrl}/task/update-state-retry/${id}`, data);
  }

  getAssignedNumbers(params) {
    return this._http.get<any>(`${environment.apiUrl}/task/a05/assigned-numbers`, { params: params });
  }

  updateUser(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/a05/update-user-msisdn`, data);
  }

  exportAssignedNumbersExcel(params: any): Observable<any> {
    return this._http.get(`${environment.apiUrl}/task/a05/export-assigned-numbers`, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }
   exportSimTransferHistoryExcel(params: any): Observable<any> {
    return this._http.get(`${environment.apiUrl}/task/a05/export-sim-transfer-history`, {
      params,
      observe: 'response',
      responseType: 'blob'
    });
  }

    getSimTransferHistory(params) {
    return this._http.get<any>(`${environment.apiUrl}/task/a05/sim-transfer-history`, { params: params });
  }
}
