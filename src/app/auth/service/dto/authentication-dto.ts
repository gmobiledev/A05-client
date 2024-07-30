export class VerifyMobileDto {
    mobile: string;
}

export class OtpDto {
    mobile: string;

    type: string;
}

export class VerifyMobileOtpDto {
    mobile: string;

    code: string;

    ref: string;

    reg_id: string;

    imei: string;

    manufacturer: string;

    model: string

    os: string;

    uuid: string;
}

export class LoginUserDto {
    mobile: string;
    password: string;

    reg_id: string;
    os: string;
    imei: string;
    manufacturer: string;
    model: string;
    uuid: string;
    version: string;
    app_version: number;
}


export class ForgotPasswordDto {
    mobile: string
}

export class ConfirmForgotPasswordDto {
    mobile: string;
    otp: string;
    uuid: string;
}

export class SetPasswordDto {
    key: string;
    password: string;
    rpassword: string;
    uuid: string
}