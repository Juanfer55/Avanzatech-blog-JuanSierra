// from angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
// services
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.sass',
})
export class LayoutComponent {
  userProfile$: Observable<any> = this.authService.userProfile$;
  isLoggedIn$: Observable<boolean> = this.authService.logStatus$;

  constructor(
    private router: Router,
    private authService: AuthService) {}

  ngOnInit() {
    if (sessionStorage.getItem('avanzablog')) {
      this.authService.getProfile().subscribe();
    }
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (res) => {
        window.location.replace('/');
      },
      error: (err) => {},
    });
  }
}
