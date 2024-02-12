// Angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
// services
import { AuthService } from '../../../services/auth.service';
// validators
import { CustomValidators } from './../../validators/customValidators';
// toast
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.sass',
})
export class RegisterComponent {
  formSubmitted = false;
  InvalidCredentials = false;
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [Validators.required, Validators.email],
          [CustomValidators.validateEmailAsync(this.authService)],
        ],
        password: ['', [Validators.required, Validators.minLength(8)]],
        passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: [CustomValidators.validadePasswords],
      }
    );
  }

  register() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const username = this.registerForm.value.username!;
      const password = this.registerForm.value.password!;

      this.authService.register(username, password).subscribe({
        next: (res) => {
          this.toastr.success('Registration Successful');
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          if (err.status === 401) {
            this.InvalidCredentials = true;
          }
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
