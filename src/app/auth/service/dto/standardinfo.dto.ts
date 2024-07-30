

export class RequestOtpMobileDto {
    msisdn: string;
    task_id: number;
    request_id: string;
}

export class VerifyMobileDto {
    task_id: number;
    request_id: string;
    otp: string;
}

export class RecentCallDto {
    task_id: number;
    request_id: string;
    dialed_numbers: string;
    first_time_request: boolean;
}

export class UploadIndentityDocDto {
    task_id: number;
    request_id: string;
    card_front: string;
    card_back: string;
    selfie: string;
    sim_card: string;
    serial_sim: string;
}

export class StandardInfoDetectOcrDto {
    task_id: number;
    request_id: string;
    fileBase64: string;
    object_detect: string;
}


export class ConfirmIdentidyDto {
    task_id: number;
    request_id: string;
    name: string;
    birth: number;
    id_no: string;
    id_poi: string;
    id_doi: number;
    resident_full: string;
    contact_mobile: string;
}

export class SignDto {
    task_id: number;
    request_id: string;
    signature: string;
}