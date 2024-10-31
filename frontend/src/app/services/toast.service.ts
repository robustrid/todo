import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  showSuccess(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title, {
      timeOut: 2000,
      closeButton: false,
      progressBar: false,
      positionClass: 'toast-bottom-center',
      tapToDismiss: true,
      toastClass: 'custom-toast-success',
    });
  }

  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      timeOut: 2000,
      closeButton: false,
      progressBar: false,
      positionClass: 'toast-bottom-center',
      tapToDismiss: true,
      toastClass: 'custom-toast-error',
    });
  }
}
