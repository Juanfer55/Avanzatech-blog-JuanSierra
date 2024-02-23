// from angular
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { Observable } from 'rxjs';
// services
import { AuthService } from '../../../services/auth.service';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { UserProfile } from '../../../models/user.model';
// angular cdk dialog
import { Dialog } from '@angular/cdk/dialog';
import { LogoutDialogComponent } from '../../../components/logout-dialog/logout-dialog.component';

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

  logOutIcon = faArrowRightFromBracket;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: Dialog
  ) {}

  ngOnInit() {
    this.authService.getProfile()?.subscribe();
  }

  logOut() {
    return this.authService.logout().subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        if (err.status === 401) {
          window.location.reload();
        }
        if (err.status === 0 || err.status === 500) {
          this.router.navigate(['/server-error']);
        }
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.logOut();
      }
    });
  }
}
