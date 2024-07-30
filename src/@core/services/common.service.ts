import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class CommonService {
    public getBrowserName() {
        const agent = window.navigator.userAgent.toLowerCase()
        switch (true) {
            case agent.indexOf('edge') > -1:
                return 'edge';
            case agent.indexOf('opr') > -1 && !!(<any>window).opr:
                return 'opera';
            case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
                return 'chrome';
            case agent.indexOf('trident') > -1:
                return 'ie';
            case agent.indexOf('firefox') > -1:
                return 'firefox';
            case agent.indexOf('safari') > -1:
                return 'safari';
            default:
                return 'other';
        }
    }

    isStringBase64(str:string){
        var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
        return base64regex.test(str);
    }
}