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
import { Subject, fromEvent } from 'rxjs';
import { ReformatCnvToolResultService } from '../reformat-cnv-tool-result.service';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { myAnimations } from 'src/app/shared/animations';

@Component({
  selector: 'app-reformat-cnv-tool-result-table',
  templateUrl: './reformat-cnv-tool-result-table.component.html',
  styleUrls: ['./reformat-cnv-tool-result-table.component.css'],
  animations: myAnimations
})
export class ReformatCnvToolResultTableComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() uploadCnvToolResultId: number;
  @ViewChild('filterInput', { static: false })
  filterInput: ElementRef;

  dialogRef: MatDialogRef<ReformatDialogComponent>;
  selectedResults: ReformatCnvToolResult[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _reformatService: ReformatCnvToolResultService,
    private _matDialog: MatDialog
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    // this._uploadReformatService.onTriggerDataChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(() => {
    //     this._uploadReformatService
    //       .getReformatCnvToolResults(this.uploadCnvToolResultId)
    //       .subscribe(updatedReformatCnvToolResults => {
    //         this.reformatCnvToolResults = updatedReformatCnvToolResults;
    //       });
    //   });

    this._reformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResults => {
        this.selectedResults = selectedResults;
      });
  }

  ngAfterViewInit() {
    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        const filterValue = this.filterInput.nativeElement.value;
        this._reformatService.onSearchTextChanged.next(
          filterValue.trim().toLowerCase()
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
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const reformatCnvToolResult: ReformatCnvToolResult = response;
      this._reformatService
        .addReformatCnvToolResult(reformatCnvToolResult)
        .subscribe(() => {
          this._reformatService.onTriggerDataChanged.next(
            reformatCnvToolResult.uploadCnvToolResultId
          );
        });
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

    this.confirmDialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }

      const reformatIds = [];
      for (const selectedRow of selectedResults) {
        reformatIds.push(selectedRow.reformatCnvToolResultId);
      }
      this._reformatService
        .deleteReformatByReformatIds(reformatIds)
        .subscribe(() => {
          this._reformatService.onSelectedChanged.next([]);
          this._reformatService.onTriggerDataChanged.next(
            selectedResults[0].uploadCnvToolResultId
          );
        });

      this.confirmDialogRef = null;
    });
  }
}
