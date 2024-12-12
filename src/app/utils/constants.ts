export enum ObjectLocalStorage {
    CURRENT_USER = 'currentUser',
    CURRENT_TASK = 'currentTask',
    CURRENT_SELECT_MOBILE = 'currentSelectMobile',
    CURRENT_PEOPLE_INFO_NEW_SIM = 'currentPeopleInfoNewsim',
    FCM_SUBSCRIBE = 'currentFcmSub',
    CURRENT_USERNAME_LOGIN = 'currentUsername',
    CURRENT_TASK_UPDATE_INFO = 'currentTaskUpdateInfo',
    ESIMQR = 'esimQR'
}

export class TaskTelecom {
    static ACTION = {
        new_sim: {
            value: 'new_sim',
            label: 'Đăng ký mới'
        },
        change_info: {
            value: 'change_info',
            label: 'Cập nhật TTTB'
        },
        change_sim: {
            value: 'change_sim',
            label: 'Đổi sim'
        },
        change_user_info: {
            value: 'change_user_info',
            label: 'Đổi thông tin'
        }
    };
}
export enum TaskTelecomStatus {
    STATUS_CANCEL = -1,
    STATUS_INIT = 0,
    STATUS_PROCESSING = 2, //giao dịch viên đã bấm tiếp nhận yêu cầu
    // STATUS_PROCESS_TO_MNO = 3, //Đã đẩy sang đối tác nhà mạng
    STATUS_REJECT = 4, //Đấu nối sang nhà mạng thất bại
    STATUS_SUCCESS = 1, //Thành công
    STATUS_NEW_ORDER = 5,
    STATUS_SUCCESS_PART = 11, // THành công 1 phần
    STATUS_Waiting_For_Payment = 20, // chờ thanh toán 
    STATUS_Waiting_For_Information = 60, // chờ thông tin sim
}

export enum ServiceCode {
    AIRTIME_TOPUP = 'AIRTIME_TOPUP',
    SIM_PROFILE = 'SIM_PROFILE',
    BUY_DATA = 'BUY_DATA',
    MerchantKitting = 'MerchantKitting',
    ĐKTTTB = 'ĐKTTTB',
    SIM_KITTING = "SIM_KITTING",
    SIM_KITTING_ESIM = "SIM_KITTING_ESIM",
    SIM_REGISTER = "SIM_REGISTER" ,
    ADD_MONEY_BALANCE = "ADD_MONEY_BALANCE",
    ADD_DATA_BALANCE = "ADD_DATA_BALANCE",
    ADD_MOBILE_PACKAGE = "ADD_MOBILE_PACKAGE",
    SIM_BUNDLE = "SIM_BUNDLE",
}

export enum TaskStatus {
    STATUS_INIT = 0,
    STATUS_REJECT = 99,
    STATUS_SUCCESS = 1,
    STATUS_CANCEL = -1,
    STATUS_WAITING = 2,
    STATUS_APPROVED = 3,
    STATUS_DISBURSING = 4, //chờ giải ngân
    STATUS_DISBURSED = 5, //Đã giải ngân
    STATUS_WAITING_BUSINESS_DEPARTMENT = 10,
    STATUS_WAITING_PAYMENT=20,
    STATUS_WAITING_ACCOUNTING = 30,
    STATUS_WATING_ITADMIN = 60,
    STATUS_IN_PROGRESS = 8,
    STATUS_SUCCESS_PART = 100,
    STATUS_FAIL = -100
}

export enum SimType {
    PHYSICAL = 1, // sim vật lý
    ESIM = 2, // esim
    GSIM = 3 // gsim
  }

export enum MsisdnStatus {
    STATUS_PROCESSED_MNO_SUCCESS = 1, //đã đấu nối
    STATUS_2G_VALID = 30, //2g được chuyển đổi
    STATUS_2G_WAITING = 31, //2g chờ đợt tiếp
    STATUS_2G_PAID = 34,//2g trả sau đã thanh toán
    STATUS_UNKNOWN = -1, // Trạng thái ko rõ của IT
    // STATUS_PREACTIVE = 91, // Trạng thái Trước kích hoạt của IT
    STATUS_SUCCESS = 1, //thành công
    STATUS_NOT_PROCESS_MNO = 2, //TTTB G99 thành công, Mạng hợp tác chưa được xử lý
    STATUS_PROCESSED_MNO_FAIL = 3, //TTTB G99 thành công, Mạng hợp tác thất bại
    STATUS_PRE_REGISTER = 4, //Hợp lệ chờ đấu nối        
    STATUS_2G_CASE_BY_CASE = 32, //2G phải được duyệt
    STATUS_2G_TS = 33,   //2G trả sau
    STATUS_4G = 40,    //Đã chuyển đổi sang sim 4G
    // STATUS_LOCK_INACTIVE = 51, //Chưa rõ
    // STATUS_GSIM = 60, //GSIM
    STATUS_S1 = 90, //Chặn 1 chiều
    STATUS_S2 = 93, //Chặn 2 chiều
    STATUS_ACTIVE_LOCKED = 94, // Trạng thái khóa từ bên IT (~số bị khóa 2 chiều)
    STATUS_S3 = 95, //Chuẩn bị thu hồi
    STATUS_TERMINATE = 99, //Chấm dứt, thu hồi
    STATUS_KITTED = 5, //Đã Kitting bên nhà mạng
    STATUS_PACKAGED = 6, //Đã Đăng ký gói cước bên nhà mạng
    STATUS_KIT_FAIL = -5, //Kitting lỗi
    STATUS_PACKAGE_FAIL = -6, //Đăng ký gói cước bên nhà mạng lỗi
}

export enum TelecomTaskSubAction {
    GSIM_TO_SIM = 'GSIM_TO_SIM',
    TYPE_2G_CONVERSION = '2G_CONVERSION',
    S198 = 'S99-GMB',
    MY_GMOBILE = 'MY_GMOBILE',
    TYPE_4G_CONVERSION_VNM_TO_VMS = '4G_VNM_TO_VMS',
    SIM_CAM_KET = "SIM_CAM_KET",
    PAY_COMMITMENT = 'PAY_COMMITMENT',
    ESIM = "ESIM",
    SIM_TO_ESIM = 'sim_to_esim',
    ESIM_REKIT_SIM = 'esim_to_sim',
    BUY_ESIM = 'buy_esim'
}

export enum CustomerType { 
    PERSONAL = "PERSONAL",
    ORGANIZATION = "ORGANIZATION"
}

export enum Priority {
    NORMAL = 'normal',
    HIGHT = 'hight'
}