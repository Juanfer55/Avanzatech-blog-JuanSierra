import { Component, Inject } from '@angular/core';
// icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
// dialog
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { DeleteDialogData } from '../../models/deleteDialog.model';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.sass',
})
export class DeleteDialogComponent {
  warningIcon = faTriangleExclamation;

  postInfo: DeleteDialogData;

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: DeleteDialogData
  ) {
    this.postInfo = data;
  }

  delete(deletePost: boolean) {
    this.dialogRef.close(deletePost);
  }
}
