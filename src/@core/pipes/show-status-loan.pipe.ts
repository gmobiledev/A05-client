import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusTask' })
export class ShowStatusLoanPipe implements PipeTransform {
    transform(value: number): string {
        let html = '';

        switch (value) {
            case TaskStatus.STATUS_SUCCESS:
                html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
                break;
            case TaskStatus.STATUS_REJECT:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Từ chối</span>'
                break;
            case TaskStatus.STATUS_CANCEL:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Hủy</span>'
                break;
            case TaskStatus.STATUS_WAITING_BUSINESS_DEPARTMENT:
                html = '<span class="badge badge-pill badge-light-primary mr-1">Chờ KD duyệt</span>'
                break;
            case TaskStatus.STATUS_WAITING_PAYMENT:
                html = '<span class="badge badge-pill badge-light-secondary mr-1">Chờ thanh toán</span>'
                break;
            case TaskStatus.STATUS_WAITING_ACCOUNTING:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ KT duyệt</span>'
                break;
            case TaskStatus.STATUS_INIT:
                html = '<span class="badge badge-pill badge-light-info mr-1">Mới khởi tạo</span>'
                break;
            case TaskStatus.STATUS_WAITING:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ duyệt</span>'
                break;
            case TaskStatus.STATUS_APPROVED:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
                break;
            case TaskStatus.STATUS_IN_PROGRESS:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đang xử lý</span>'
                break;
            case TaskStatus.STATUS_SUCCESS_PART:
                html = '<span class="badge badge-pill badge-light-success mr-1">Thành công 1 phần</span>'
                break;
            case TaskStatus.STATUS_FAIL:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Thất bại</span>'
                break;
            default:
                html = value + '';
        }

        return html;

    }
}