import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Input,
  OnChanges
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UploadCnvToolResult } from 'src/app/upload/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil } from 'rxjs/operators';
import { AnalysisService } from '../analysis.service';
import { myAnimations } from 'src/app/animations';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss'],
  animations: myAnimations
})
export class ChooseFileComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() samplesetId: number;
  @Input() referenceGenome: string;
  uploads: any;
  displayedColumns = [
    'select',
    'fileName',
    'fileInfo',
    'cnvToolName',
    'tagDescriptions',
    'createDate'
  ];

  dialogRef: any;

  dataSource: MatTableDataSource<UploadCnvToolResult>;
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  selectedFiles: UploadCnvToolResult[];

  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _service: AnalysisService, public _matDialog: MatDialog) {
    this.selectedFiles = [];
    this._unsubscribeAll = new Subject();
  }

  onDelselectedAll() {
    this.selectedFiles = [];
  }
  onSubmitAllSelected(selectedUploadCnvToolResults) {
    let confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
    confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    let rowNames = '';
    selectedUploadCnvToolResults.forEach(
      (uploadCnvToolResult: UploadCnvToolResult, index) => {
        if (index === 0) {
          rowNames += uploadCnvToolResult.fileName;
        } else {
          rowNames += `, ${uploadCnvToolResult.fileName}`;
        }
      }
    );
    confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to submit?' + rowNames;

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedFiles = [];
      }
      confirmDialogRef = null;
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // this._service
    //   .getUploadCnvToolResults(this.referenceGenome, this.samplesetId)
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(UploadCnvToolResults => {
    //     this.dataSource = new MatTableDataSource(UploadCnvToolResults);
    //     this.dataSource.sort = this.matSort;
    //   });
  }

  ngOnChanges() {
    this._service
      .getUploadCnvToolResults(this.referenceGenome, this.samplesetId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(UploadCnvToolResults => {
        this.dataSource = new MatTableDataSource(UploadCnvToolResults);
        this.dataSource.sort = this.matSort;
      });
  }

  ngAfterViewInit() {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
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
    this.selectedFiles = this.selection.selected;
  }

  toggleRow(upload: UploadCnvToolResult) {
    this.selection.toggle(upload);
    this.selectedFiles = this.selection.selected;
  }
}
