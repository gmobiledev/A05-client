import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
  /**
   *
   */
  constructor(
    
  ) {}

  showConfirm(title, text = '', confirmButtonText = 'Đồng ý', cancelButtonText = 'Hủy', allowOutsideClick = true, showCloseButton = false) {
    return Swal.fire({
        title: title,        
        text: "",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7367F0',
        cancelButtonColor: '#E42728',
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        animation: true,
        allowOutsideClick: allowOutsideClick,
        allowEscapeKey: allowOutsideClick,
        showCloseButton: showCloseButton,
        showClass: { popup: 'animate__animated animate__flipInX' },
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger ml-1'
        }
      })
  }

  showSuccess(message: string, timer: number = 3500) {
    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: message,
        timer: timer,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showError(message, timer = 3500) {
    Swal.fire({
        icon: 'warning',
        title: 'Thông báo!',
        text: message,
        timer: timer,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showMess(message,timer = 3500) {
    Swal.fire({
        icon: 'info',
        title: '',
        text: message,
        timer: timer,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showSuccessToast(message) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'success',
      title: message
    })
  }

  showLoadingPopup() {
    Swal.fire({
      html: '',
      showConfirmButton: false
  });
  }
  
}
