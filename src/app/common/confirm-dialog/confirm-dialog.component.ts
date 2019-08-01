import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  public confirmMessage: string;

  /**
   * Constructor
   *
   * @param dialogRef - dialog
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
