import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ReformatCnvToolResult } from '../upload-reformat.model';
import { takeUntil } from 'rxjs/operators';
import { UploadReformatService } from '../upload-reformat.service';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { UploadReformatDialogComponent } from '../upload-reformat-dialog/upload-reformat-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-upload-reformat-list',
  templateUrl: './upload-reformat-list.component.html',
  styleUrls: ['./upload-reformat-list.component.scss']
})
export class UploadReformatListComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() reformatCnvToolResults: ReformatCnvToolResult[];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dialogRef: MatDialogRef<UploadReformatDialogComponent>;
  selection = new SelectionModel<ReformatCnvToolResult>(true, []);
  displayedColumns = [
    'select',
    'no',
    'sampleName',
    'chromosome',
    'startBasepair',
    'endBasepair',
    'cnvType',
    'edit'
  ];

  // Private
  private _unsubscribeAll: Subject<any>;
  // dataSource: UploadReformatDataSource | null;
  dataSource: MatTableDataSource<ReformatCnvToolResult>;
  constructor(
    private _uploadReformatService: UploadReformatService,
    public _matDialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();

    this._unsubscribeAll = new Subject();
  }

  ngOnChanges(): void {
    this.dataSource.data = this.reformatCnvToolResults;
    this.dataSource.sort = this.sort;
  }
  ngOnInit() {
    this._uploadReformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResult => {
        if (!selectedResult || selectedResult.length < 1) {
          this.selection.clear();
        }
      });

    this._uploadReformatService.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((filterValue: string) => {
        this.dataSource.filter = filterValue.trim().toLowerCase();
      });
  }

  ngAfterViewInit(): void {}
  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onEditData(reformatCnvToolResult: ReformatCnvToolResult): void {
    this._uploadReformatService.onSelectedChanged.next([]);
    // Original data
    this.dialogRef = this._matDialog.open(UploadReformatDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        reformatCnvToolResult: reformatCnvToolResult,
        action: DialogAction.Edit
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const updatedData: ReformatCnvToolResult = response;

      this._uploadReformatService
        .editReformatCnvToolResult(updatedData)
        .subscribe(() => {
          this._uploadReformatService.onTriggerDataChanged.next();
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
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this._uploadReformatService.onSelectedChanged.next(this.selection.selected);
  }

  toggleSelect(reformatCnvToolResult: ReformatCnvToolResult) {
    this.selection.toggle(reformatCnvToolResult);
    this._uploadReformatService.onSelectedChanged.next(this.selection.selected);
  }
}
