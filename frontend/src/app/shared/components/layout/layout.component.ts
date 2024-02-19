// from angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
// services
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.sass',
})
export class LayoutComponent {
  userProfile$: Observable<any> = this.authService.userProfile$;
  isLoggedIn$: Observable<boolean> = this.authService.logStatus$;

  showLogoutPopup = false;

  logOutIcon = faArrowRightFromBracket;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toast: ToastrService) {}

  ngOnInit() {
    if (sessionStorage.getItem('avanzablog')) {
      this.authService.getProfile().subscribe();
    }
  }

  logOut() {
    this.authService.logout().subscribe({
      next: (res) => {
        this.showLogoutPopup = false;
        window.location.reload();
        this.toast.success('Logged out successfully', 'Success', {
          positionClass: 'toast-top-full-width',
        });
      },
      error: (err) => {},
    });
  }
}
