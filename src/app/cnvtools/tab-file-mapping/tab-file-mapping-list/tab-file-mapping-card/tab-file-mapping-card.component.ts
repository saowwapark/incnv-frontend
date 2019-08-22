import { ConfirmDialogComponent } from '../../../../common/confirm-dialog/confirm-dialog.component';
import { TabFileMappingService } from '../../tab-file-mapping.service';
import { Component, Input } from '@angular/core';
import { TabFileMappingConfigured, CODEX2 } from '../../tab-file-mapping.model';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TabFileMappingFormDialogComponent } from '../../tab-file-mapping-form/tab-file-mapping-form.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-tab-file-mapping-card',
  templateUrl: './tab-file-mapping-card.component.html',
  styleUrls: ['./tab-file-mapping-card.component.scss']
})
export class TabFileMappingCardComponent {
  @Input()
  fileMappingConfigured: TabFileMappingConfigured;
  dialogRef;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _matDialog: MatDialog,
    private _fileMappingService: TabFileMappingService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Edit contact
   *
   * @param contact
   */
  onEditTabFileMappingConfigured(
    fileMappingConfigured: TabFileMappingConfigured
  ): void {
    this.dialogRef = this._matDialog.open(TabFileMappingFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        fileMappingConfigured: fileMappingConfigured,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];

      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this._fileMappingService.updateTabFileMappingConfigured(
            formData.getRawValue()
          );

          break;
        /**
         * Delete
         */
        case 'delete':
          this.onDeleteTabFileMappingConfigured(fileMappingConfigured);

          break;
      }
    });
  }
  /**
   * Delete TabFileMapping Configured
   */
  onDeleteTabFileMappingConfigured(fileMappingConfigured): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._fileMappingService.deleteTabFileMappingConfigured(
          fileMappingConfigured
        );
      }
      this.confirmDialogRef = null;
    });
  }
}
