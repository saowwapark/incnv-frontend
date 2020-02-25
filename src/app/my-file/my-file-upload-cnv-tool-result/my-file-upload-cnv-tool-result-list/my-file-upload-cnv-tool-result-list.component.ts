import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
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
import { UploadCnvToolResult } from '../../../shared/models/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { MyFileUploadCnvToolResultService } from '../my-file-upload-cnv-tool-result.service';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { UploadDialogComponent } from '../upload-dialog/upload-dialog.component';
import { IdAndName } from 'src/app/shared/models/id-and-name.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { TabFileMappingService } from 'src/app/tab-file-mapping/tab-file-mapping.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-my-file-upload-cnv-tool-result-list',
  templateUrl: './my-file-upload-cnv-tool-result-list.component.html',
  styleUrls: ['./my-file-upload-cnv-tool-result-list.component.scss']
})
export class MyFileUploadCnvToolResultListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  uploads: any;
  displayedColumns = [
    'select',
    'no',
    'fileName',
    'fileInfo',
    'referenceGenome',
    'cnvToolName',
    'tabFileMappingName',
    'samplesetName',
    'tagDescriptions',
    'createDate',
    'edit',
    'detail'
  ];

  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  dataSource: MatTableDataSource<UploadCnvToolResult> = new MatTableDataSource(
    []
  );
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  samplesets: IdAndName[];
  tabFileMappings: IdAndName[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _service: MyFileUploadCnvToolResultService,
    public _matDialog: MatDialog,
    private _samplesetService: SamplesetService,
    private _tabFileMappingService: TabFileMappingService
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

    this._samplesetService
      .getIdAndNames()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        this.samplesets = samplesets;
      });

    this._tabFileMappingService
      .getIdAndNames()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(tabFileMappings => {
        this.tabFileMappings = tabFileMappings;
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
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
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

  onEditData(uploadCnvToolResult: UploadCnvToolResult): void {
    this._service.onSelectedChanged.next([]);
    // Original data
    this.dialogRef = this._matDialog.open(UploadDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.Edit,
        tabFileMappings: this.tabFileMappings,
        samplesets: this.samplesets,
        uploadCnvToolResult: uploadCnvToolResult
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe((response: UploadCnvToolResult) => {
      if (!response) {
        return;
      }
      response.uploadCnvToolResultId =
        uploadCnvToolResult.uploadCnvToolResultId;
      const updatedData: UploadCnvToolResult = response;

      this._service.editUploadCnvToolResult(updatedData).subscribe(() => {
        this._service.onTriggerDataChanged.next();
      });
    });
  }
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
