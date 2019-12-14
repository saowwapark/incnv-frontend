import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';

import { Subject } from 'rxjs';
import { UploadCnvToolResult } from '../../../upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { UploadHistoryUploadCnvToolResultService } from '../upload-history-uploadcnvtoolresult.service';

@Component({
  selector: 'app-upload-history-uploadcnvtoolresult-list',
  templateUrl: './upload-history-uploadcnvtoolresult-list.component.html',
  styleUrls: ['./upload-history-uploadcnvtoolresult-list.component.scss']
})
export class UploadHistoryUploadCnvToolResultListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  uploads: any;
  displayedColumns = [
    'select',
    'fileName',
    'fileInfo',
    'referenceGenome',
    'cnvToolName',
    'tabFileMappingName',
    'samplesetName',
    'tagDescriptions',
    'createDate',
    'detail'
  ];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  dataSource: MatTableDataSource<UploadCnvToolResult>;
  selection = new SelectionModel<UploadCnvToolResult>(true, []);

  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _service: UploadHistoryUploadCnvToolResultService,
    public _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._service.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(rows => {
        if (!rows || rows.length < 1) {
          this.selection.clear();
        }
      });
  }

  ngAfterViewInit() {
    this._service.onTriggerDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._service
          .getUploadCnvToolResults()
          .subscribe(UploadCnvToolResults => {
            this.dataSource = new MatTableDataSource(UploadCnvToolResults);
            this.dataSource.sort = this.matSort;
          });
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Methods
  // -----------------------------------------------------------------------------------------------------

  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(sampleset =>
          this.selection.select(sampleset)
        );
    this._service.onSelectedChanged.next(this.selection.selected);
  }

  toggleRow(upload: UploadCnvToolResult) {
    this.selection.toggle(upload);
    this._service.onSelectedChanged.next(this.selection.selected);
  }
}
