// angular
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// dialog
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-logout-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.sass'
})
export class LogoutDialogComponent {
  constructor(
    private dialogRef: DialogRef<boolean>,
  ) {}

  closeModal() {
    this.dialogRef.close();
  }

  sendConfirmationToComponent(confirmation: boolean) {
    this.dialogRef.close(confirmation);
  }
}
