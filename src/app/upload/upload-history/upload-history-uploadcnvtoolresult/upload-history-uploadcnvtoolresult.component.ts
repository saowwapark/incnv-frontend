import { UploadHistoryUploadCnvToolResultService } from './upload-history-uploadcnvtoolresult.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { myAnimations } from 'src/app/animations';
@Component({
  selector: 'app-upload-history-uploadcnvtoolresult',
  templateUrl: './upload-history-uploadcnvtoolresult.component.html',
  styleUrls: ['./upload-history-uploadcnvtoolresult.component.scss'],
  animations: myAnimations
})
export class UploadHistoryUploadcnvtoolresultComponent implements OnInit {
  @ViewChild('filterInput', { static: true })
  filterInput: ElementRef;

  selectedUploads: any[] = [];
  hasSelectedRows = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    public uploadHistoryService: UploadHistoryUploadCnvToolResultService,
    public _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  onSubmitAllSelected(selectedUploads) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    let rowNames = '';
    selectedUploads.forEach((selectedUpload, index) => {
      if (index === 0) {
        rowNames += selectedUpload.fileName;
      } else {
        rowNames += `, ${selectedUpload.fileName}`;
      }
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?' + rowNames;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        selectedUploads.forEach(selectedRow => {
          this.uploadHistoryService
            .deleteUploadCnvToolResult(selectedRow.samplesetId)
            .subscribe(() => {
              this.uploadHistoryService.onSelectedChanged.next([]);
              this.uploadHistoryService.onTriggerDataChanged.next();
            });
        });
      }
      this.confirmDialogRef = null;
    });
  }

  onDelselectedAll() {
    this.uploadHistoryService.onSelectedChanged.next([]);
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.uploadHistoryService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedRows => {
        this.selectedUploads = selectedRows;
      });
  }
}
