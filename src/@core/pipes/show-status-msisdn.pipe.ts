import { Pipe, PipeTransform } from '@angular/core';
import { MsisdnStatus, TaskTelecomStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusMsisdn' })
export class ShowStatusMsisdnPipe implements PipeTransform {
  transform(value: number): string {
    let html = value + '';
    if (value === null) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">Chưa xử lý</span>'
    } else if (value === MsisdnStatus.STATUS_PROCESSED_MNO_SUCCESS) {
      html = '<span class="badge badge-pill badge-light-success mr-1">Đã đấu nối</span>'
    } else if (value === TaskTelecomStatus.STATUS_CANCEL) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Đã hủy</span>'
    } else if (value === MsisdnStatus.STATUS_PROCESSED_MNO_FAIL) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Đã từ chối</span>'
    } else if (value === MsisdnStatus.STATUS_2G_VALID) {
      html = '<span class="badge badge-pill badge-light-success mr-1">2G được chuyển đổi</span>'
    } else if (value === MsisdnStatus.STATUS_2G_WAITING) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">2G Chờ đợt tiếp theo</span>'
    }else if (value === MsisdnStatus.STATUS_2G_CASE_BY_CASE) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">2G case by case</span>'
    }else if (value === MsisdnStatus.STATUS_2G_PAID) {
      html = '<span class="badge badge-pill badge-light-success mr-1">2G đã trả cước</span>'
    } else if (value === MsisdnStatus.STATUS_4G) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Đã chuyển đổi 4G</span>'
    } else if (value === MsisdnStatus.STATUS_PRE_REGISTER) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Chuẩn bị đấu nối</span>'
    } else if (value === MsisdnStatus.STATUS_NOT_PROCESS_MNO) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Mạng hợp tác chưa xử lý</span>'
    } else if (value === MsisdnStatus.STATUS_2G_TS) {
      html = '<span class="badge badge-pill badge-light-info mr-1">2G trả sau</span>'
    } else if (value === MsisdnStatus.STATUS_S1) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">Khóa 1 chiều S1</span>'
    } else if (value === MsisdnStatus.STATUS_S2) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">Khóa 2 chiều S2</span>'
    } else if (value === MsisdnStatus.STATUS_S3) {
      html = '<span class="badge badge-pill badge-light-warning mr-1">Chuẩn bị thu hồi</span>'
    } else if (value === MsisdnStatus.STATUS_TERMINATE) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Đã thu hồi</span>'
    } else if (value === MsisdnStatus.STATUS_ACTIVE_LOCKED) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">IT khóa</span>'
    } else if (value === MsisdnStatus.STATUS_KITTED) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Đã kitting</span>'
    } else if (value === MsisdnStatus.STATUS_KIT_FAIL) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Kitting lỗi</span>'
    } else if (value === MsisdnStatus.STATUS_PACKAGED) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Đã đăng ký gói</span>'
    } else if (value === MsisdnStatus.STATUS_PACKAGE_FAIL) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Đăng ký gói lỗi</span>'
    }
    return html;
  }
}