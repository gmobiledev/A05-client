import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CommonDataService {
    /**
     *
     * @param {HttpClient} _http
     */
    constructor(private _http: HttpClient) { }

    getContries() {
        return this._http.get<any>(`${environment.apiUrl}/area/countries`);
    }
    getProvinces() {
        return this._http.get<any>(`${environment.apiUrl}/area/get-provinces`);
    }
    getDistricts(provinceId: number) {
        return this._http.get<any>(`${environment.apiUrl}/area/get-districts/${provinceId}`);
    }
    getCommunes(districtId: number) {
        return this._http.get<any>(`${environment.apiUrl}/area/get-communes/${districtId}`);
    }
}