// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// services
import { AuthService } from './../../../services/auth.service';
// forms
import {
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
// router
import { Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {
  InvalidCredentials = false;
  formSubmitted = false;

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;

      this.authService.login(username, password).subscribe({
        error: (err) => {
          if (err.status === 401) {
            this.InvalidCredentials = true;
          }
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
