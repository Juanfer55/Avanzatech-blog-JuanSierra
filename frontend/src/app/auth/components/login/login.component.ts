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
import { Router, RouterLink } from '@angular/router';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye as seeIcon} from '@fortawesome/free-regular-svg-icons';
import { faEye as unSeeIcon} from '@fortawesome/free-solid-svg-icons';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { PostService } from '../../../services/postservice.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.sass',
})
export class LoginComponent {

  invalidCredentials = false;
  formSubmitted = false;
  showPassword = false;

  errorIcon = faX;
  faEyeIcon = unSeeIcon;
  faEyeSlashIcon = seeIcon;

  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  private buildForm() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  private handleErrors(err: any) {
    if (err.status === 0 || err.status === 500) {
      this.router.navigate(['/server-error']);
    }
  }

  getPosts() {
    return this.postService.getPosts().subscribe({
      next: () => {
        window.scrollTo(0, 0);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.handleErrors(err);
      },
    });
  }

  login() {
    this.formSubmitted = true;
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username!;
      const password = this.loginForm.value.password!;

      this.authService.login(username, password).subscribe({
        next: () => {
          this.getPosts();
        },
        error: (err) => {
          if (err.status === 400) {
            this.invalidCredentials = true;
          } else {
            this.handleErrors(err);
          }
        },
      });
    } else {
      return this.loginForm.markAllAsTouched();
    }
  }
}
