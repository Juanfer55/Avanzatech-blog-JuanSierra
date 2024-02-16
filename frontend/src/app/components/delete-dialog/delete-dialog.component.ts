import { Component, Inject } from '@angular/core';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
// dialog
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
// services
import { PostserviceService } from '../../services/postservice.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.sass'
})
export class DeleteDialogComponent {
  closeIcon = faClose;

  postInfo: any;

  constructor(
    private postService: PostserviceService,
    private router: Router,
    private toast: ToastrService,
    private dialogRef: DialogRef<DeleteDialogComponent>,
    @Inject(DIALOG_DATA) public data: any
  ) {
    this.postInfo = data;
  }

  closeModal() {
    this.dialogRef.close();
  }

  deletePost() {
    return this.postService.deletePost(this.postInfo.postId).subscribe({
      next: () => {
        this.toast.success('Post deleted successfully!');
        this.dialogRef.close();
        window.location.reload();
      },
      error: () => {
        this.toast.error('Something went wrong!');
        this.dialogRef.close();
      },
    });
  }
}