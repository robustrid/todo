import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { Messages } from '../../../shared/messages';
import { ApiError } from '../../../shared/interfaces/api-error';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.signupForm.valid) {
      const { name, email, password } = this.signupForm.value;

      try {
        await this.userService.register({ name, email, password }).toPromise();
        this.toastService.showSuccess(Messages.user.createdSuccess);
        this.router.navigate(['/login']);
      } catch (error: any) {
        let errorMsg: string = Messages.user.creationFailed;

        if (error?.error) {
          const apiError: ApiError = error.error;
          errorMsg = apiError.message;
          if (apiError.details) {
            errorMsg += `: ${apiError.details}`;
          }
        }

        this.toastService.showError(errorMsg);
      }
    } else {
      this.toastService.showError(Messages.general.fillFieldsCorrectly, 'Validation Error');
    }
  }
}
