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
import { UserProfile } from '../../../models/user.model';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.sass',
})
export class LayoutComponent {
  userProfile$: Observable<UserProfile | null> = this.authService.userProfile$;
  isLoggedIn$: Observable<boolean> = this.authService.logStatus$;

  showLogoutPopup = false;

  logOutIcon = faArrowRightFromBracket;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getProfile()?.subscribe();
  }

  logOut() {
    this.authService.logout().subscribe({
      next: () => {
        this.showLogoutPopup = false;
        window.location.reload();
      },
      error: (err) => {
        this.showLogoutPopup = false;
        if (err.status === 401) {
          window.location.reload();
        }
        if (err.status === 0 || err.status === 500) {
          this.router.navigate(['/server-error']);
        }
      },
    });
  }
}
