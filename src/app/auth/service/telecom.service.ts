import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { AddKitDto, CardEkycDto, DataReCharge, LockMobileDto, RemoveNumberDto, ScanSerialDto, SelfieEkycDto, SignatureEkycDto } from './dto/new-sim.dto';
import { ConfirmIdentidyDto, RecentCallDto, RequestOtpMobileDto, SignDto, UploadIndentityDocDto, VerifyMobileDto } from './dto/standardinfo.dto';

@Injectable({ providedIn: 'root' })
export class TelecomServivce {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all users
   */
  findMsisdn(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/msisdn`, { params: params });
  }

  publicLookup2G(body = {}) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/msisdn/public/lookup/2g`, body);
  }

  beforeSumitChangeSim(body = {}) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/msisdn`, body);
  }
  onSubmitChangeSim(id: number, body = {}) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/msisdn/card-sim/${id}`, body);
  }

  taskList(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/task`, { params: params }).toPromise();
  }

  taskCreate(data: LockMobileDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/add`, data).toPromise();
  }

  taskDetail(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/task/${id}`);
  }

  taskDelete(id) {
    return this._http.delete<any>(`${environment.apiTelecomUrl}/task/${id}`);
  }

  taskAddKit(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/add-kit`, data);
  }

  taskRemoveMobile(data: RemoveNumberDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/remove`, data);
  }

  taskCardEkyc(data: CardEkycDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/card-ekyc`, data);
  }

  taskConfirmEkyc(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/confirm-ekyc`, data);
  }

  taskSelfieEkyc(data: SelfieEkycDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/selfie-ekyc`, data);
  }

  taskDocSigner(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/doc-signer/fill-form`, data);
  }

  taskSignatureEkyc(data: SignatureEkycDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/signature-ekyc`, data);
  }

  getAllTask(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/task`, { params: params });
  }

  getDetailSim(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/task/search/msisdn`, { params: params });
  }

  getSummary() {
    return this._http.get<any>(`${environment.apiTelecomUrl}/task/summary`);
  }

  rechargeSim(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/add-mobile-package`,data);
  }

  taskScanSerial(data: ScanSerialDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/scan-serial`, data);
  }

  standardInfoRequestOtp(data: RequestOtpMobileDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/request-otp-mobile`, data);
  }

  standardInfoResendOtp(data: RequestOtpMobileDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/resend-otp`, data);
  }

  standardInfoVerifyMobile(data: VerifyMobileDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/verify-mobile`, data);
  }

  standardInfoRecentCall(data: RecentCallDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/recent-contact`, data);
  }

  standardInfoUploadIndentity(data: UploadIndentityDocDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/upload-identity`, data);
  }

  standardInfoScanSerial(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/scan-serial`, data);
  }

  standardInfoConfirmIdentity(data: ConfirmIdentidyDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/confirm-identity`, data);
  }

  standardInfoSign(data: SignDto) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/standard-info/sign`, data);
  }

  getTypeIdentificationNo(id_no: string) {
    if (id_no.length == 9)
      return "CMND"
    else if (id_no.length == 12) {
      return "CCCD"
    }
    else
      return "CUSTOMER"
  }

  assignUserSubscriber(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/oganization-assign`, data);
  }
  updateCustomerByTask(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/create/customer/confirm`, data);
  }

  createNewCustomerOCR(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/create/subscriber/ocr`, data);
  }

  submitOrganizationContract(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/submit-oganization-contract`, data);
  }

  uploadOganizationContract(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/upload-oganization-contract`, data);
  }

  updateSubscription(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/require-change-info-TTTB`, data);
  }

  putSubscription(id, data) {
    return this._http.put<any>(`${environment.apiTelecomUrl}/task/require-change-info-TTTB/${id}`, data);
  }

  submitSignature(id, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/require-change-info-TTTB/${id}/signature`, data);
  }

  getMyGmobileNumber(id_no, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/subscriber/my-gmobile/${id_no}`, data);
  }

  sendOTPMsisdn(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/subscriber/send-otp`, data);
  }

  verifyOTPMsisdn(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/subscriber/verify-otp`, data);
  }

  initTask(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/init`, data);
  }

  addShipInfo(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/ship-info`, data);
  }

  getEsimQR(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/download-esim`, data);
  }

  confirmPayTask(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/confirm-pay`, data);
  }

  verifyCallLog(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/task/verify-calllog`, data);
  }
}
