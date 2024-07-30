import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class GipService {

  constructor(private _http: HttpClient) { }

  getAllSub(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/msisdn`, { params: params });
  }

  getAllCall(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/msisdn/cdrs`, { params: params });
  }

  getTask(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/task`, { params: params });
  }

  getPackage(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/msisdn/package`, { params: params });
  }

  getLog(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/action-log`, { params: params });
  }

  getReport(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/task/report/balance-changes`, { params: params });
  }

  getSettings(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/settings`, { params: params });
  }

  updateSettings(data) {
    return this._http.patch<any>(`${environment.apiGipUrl}/settings/ip`, data);
  }

  lockGip(action, msisdn, note) {
    return this._http.post<any>(`${environment.apiGipUrl}/task`, { action: action, msisdn: msisdn, note: note });
  }

  exportData(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/msisdn/export-excel`, data);
  }

}
