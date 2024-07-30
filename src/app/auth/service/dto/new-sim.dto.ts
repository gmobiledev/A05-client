export class LockMobileDto {
    mobile: string;
    task_id: number;
}

export class AddKitDto {
    mobile: string;
    task_id: number;
    package: string;
    serial: string;
    sim_file: string;
}

export class RemoveNumberDto {
    mobile: string;
    task_id: number;
}

export class CardEkycDto {
    task_id: number;
    card_front: string;
    card_back: string;
    isOcr: number
}

export class ConfirmEkyc {
    task_id: string;
    mobile: string;
    name: string;
    identification_type: string;
    identification_no: string;
    identification_expire_date: number;
    identification_date: number;
    identification_place: string;
    gender: string;
    birth: number;
    country: string;
    home_province: number;
    home_district: number;
    home_commune: number;
    home_address: string;
    home_full_address: string;
    residence_province: number;
    residence_district: number;
    residence_commune: number;
    residence_address: string;
    residence_full_address: string;
    province: number;
    district: number;
    commune: number;
    address: string;
    full_address: string;
    identification_back_file: string;
    identification_front_file: string;
    constructor(partial: Partial<ConfirmEkyc> = {}) {
        Object.assign(this, partial);
      }
}

export class SelfieEkycDto {
    task_id: number;
    selfie: string;
}

export class SignatureEkycDto {
    task_id: number;
    signature: string;
}

export class DataReCharge {
    package: string;
    msisdn: string;
}

export class ScanSerialDto {
    fileBase64: string;
    object_detect: string;
}