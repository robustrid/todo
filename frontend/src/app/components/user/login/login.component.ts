import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { ToastService } from '../../../services/toast.service';
import { Messages } from '../../../shared/messages';
import { ApiError } from '../../../shared/interfaces/api-error';
import { TokenService } from '../../../services/token.service';
import { LoginResponse } from 'src/app/shared/interfaces/login-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastService: ToastService,
    private tokenService: TokenService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      try {
        const response = await this.userService.login({ email, password }).toPromise();
        if (response && response.data) {
          this.tokenService.setToken(response.data.token);
          this.toastService.showSuccess(Messages.user.loginSuccess);
          this.router.navigate(['dashboard']);
        } else {
          this.toastService.showError(Messages.user.loginFailed);
        }
      } catch (error: any) {
        let errorMsg: string = Messages.user.loginFailed;

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
