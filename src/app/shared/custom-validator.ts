import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function mobilePhoneValidator(): ValidatorFn {
    return (control:AbstractControl) : ValidationErrors | null => {

        const value = control.value;

        if (!value) {
            return null;
        }
        if(value.length < 10) {
            return {isMobile: true} ;
        }
        const list = [
            '086', '096', '097','098', '032', '033', '034', '035', '036', '037', '038', '039',
            '091', '094', '088', '083', '084', '085', '081', '082',
            '090', '093', '070', '079', '077', '076', '078','089',
            '092', '056', '058',
            '087',//itel
            '099', '059', //Gmoible

        ]
        if(!list.includes(value.substring(0,3))) {
            return {isMobile: true} ;
        }

        return null;       
    }
}