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
// angular cdk dialog
import { Dialog } from '@angular/cdk/dialog';
import { LogoutDialogComponent } from '../../../components/logout-dialog/logout-dialog.component';
import { PostService } from '../../../services/postservice.service';

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
    private toast: ToastrService,
    private router: Router,
    private dialog: Dialog,
    private postservice: PostService
  ) {}

  ngOnInit() {
    this.getProfile();
  }

  private handleErrors(err: any) {
    if (err.status === 0 || err.status === 500) {
      this.router.navigate(['/server-error']);
    }
  }

  getProfile() {
    return this.authService.getProfile()?.subscribe({
      error: (err) => {
        this.handleErrors(err);
      },
    });
  }

  logout() {
    return this.authService.logout().subscribe({
      next: () => {
        this.toast.success('You have been logged out');
        this.postservice.resetPostPage();
        this.postservice.resetPostState();
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toast.error('An error occurred while logging out');
        this.handleErrors(err);
      },
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.closed.subscribe((result) => {
      if (result) {
        this.logout();
      }
    });
  }
}
