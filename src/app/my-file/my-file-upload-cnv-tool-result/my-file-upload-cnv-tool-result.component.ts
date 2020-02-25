import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { MyFileUploadCnvToolResultService } from './my-file-upload-cnv-tool-result.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { myAnimations } from 'src/app/shared/animations';
@Component({
  selector: 'app-my-file-upload-cnv-tool-result',
  templateUrl: './my-file-upload-cnv-tool-result.component.html',
  styleUrls: ['./my-file-upload-cnv-tool-result.component.scss'],
  animations: myAnimations
})
export class MyFileUploadCnvToolResultComponent implements OnInit {
  @ViewChild('filterInput', { static: true })
  filterInput: ElementRef;

  selectedUploads: any[] = [];
  hasSelectedRows = false;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  private _unsubscribeAll: Subject<any>;

  constructor(
    public _myFileService: MyFileUploadCnvToolResultService,
    public _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  onSubmitAllSelected(selectedUploads: UploadCnvToolResult[]) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    let rowNames = '';
    const ids: number[] = [];
    selectedUploads.forEach((selectedUpload, index) => {
      ids.push(selectedUpload.uploadCnvToolResultId);
      if (index === 0) {
        rowNames += selectedUpload.fileName;
      } else {
        rowNames += `, ${selectedUpload.fileName}`;
      }
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?' + rowNames;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      this._myFileService.deleteUploadCnvToolResults(ids).subscribe(() => {
        this._myFileService.onSelectedChanged.next([]);
        this._myFileService.onTriggerDataChanged.next();
      });

      this.confirmDialogRef = null;
    });
  }

  onDelselectedAll() {
    this._myFileService.onSelectedChanged.next([]);
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._myFileService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedRows => {
        this.selectedUploads = selectedRows;
      });
  }
}
