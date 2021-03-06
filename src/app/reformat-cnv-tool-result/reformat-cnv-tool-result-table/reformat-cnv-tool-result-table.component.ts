import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  ElementRef,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ReformatCnvToolResult } from '../reformat-cnv-tool-result.model';
import { ReformatDialogComponent } from './reformat-dialog/reformat-dialog.component';
import { Subject, fromEvent, concat } from 'rxjs';
import { ReformatCnvToolResultService } from '../reformat-cnv-tool-result.service';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  tap,
  mergeMap,
  switchMap,
  map,
  filter
} from 'rxjs/operators';

import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { myAnimations } from 'src/app/shared/animations';
import { SearchService } from 'src/app/shared/components/search/search.service';

@Component({
  selector: 'app-reformat-cnv-tool-result-table',
  templateUrl: './reformat-cnv-tool-result-table.component.html',
  styleUrls: ['./reformat-cnv-tool-result-table.component.css'],
  animations: myAnimations
})
export class ReformatCnvToolResultTableComponent implements OnInit, OnDestroy {
  @Input() uploadCnvToolResultId: number;

  dialogRef: MatDialogRef<ReformatDialogComponent>;
  selectedResults: ReformatCnvToolResult[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<void>;

  constructor(
    private _reformatService: ReformatCnvToolResultService,
    private _matDialog: MatDialog,
    private _searchService: SearchService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._reformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResults => {
        this.selectedResults = selectedResults;
      });
    this._searchService.search$
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(searchedText => {
        this._reformatService.onSearchTextChanged.next(
          searchedText.trim().toLowerCase()
        );
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
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New Sampleset
   */
  onAddData(): void {
    // Original data
    this.dialogRef = this._matDialog.open(ReformatDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.New,
        reformatCnvToolResult: new ReformatCnvToolResult()
      },
      disableClose: true
    });

    // Updated data
    let reformatCnvToolResult: ReformatCnvToolResult;
    this.dialogRef
      .afterClosed()
      .pipe(
        // if false, this means closing dialog by pressing close button.
        filter(response => !!response),
        switchMap((response: ReformatCnvToolResult) => {
          reformatCnvToolResult = response;
          return this._reformatService.addReformatCnvToolResult(
            reformatCnvToolResult
          );
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._reformatService.onTriggerDataChanged.next(
          reformatCnvToolResult.uploadCnvToolResultId
        );
      });
  }
  onDelselectedAll() {
    this._reformatService.onSelectedChanged.next([]);
  }
  onSubmitAllSelected(selectedResults) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef
      .afterClosed()
      .pipe(
        filter(response => !!response),
        switchMap(() => {
          const reformatIds = [];
          for (const selectedRow of selectedResults) {
            reformatIds.push(selectedRow.reformatCnvToolResultId);
          }
          return this._reformatService.deleteReformatByReformatIds(reformatIds);
        }),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._reformatService.onSelectedChanged.next([]);
        this._reformatService.onTriggerDataChanged.next(
          selectedResults[0].uploadCnvToolResultId
        );
        this.confirmDialogRef = null;
      });
  }
}
