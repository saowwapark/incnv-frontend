import { ReformatDialogComponent } from './reformat-dialog/reformat-dialog.component';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  AfterViewInit,
  ElementRef,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Subject, fromEvent } from 'rxjs';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { ReformatCnvToolResult } from './reformat-cnv-tool-result.model';
import { PreviewReformatCnvToolResultService } from './preview-reformat-cnv-tool-result.service';
import { myAnimations } from 'src/app/shared/animations';

@Component({
  selector: 'app-preview-reformat-cnv-tool-result',
  templateUrl: './preview-reformat-cnv-tool-result.component.html',
  styleUrls: ['./preview-reformat-cnv-tool-result.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: myAnimations
})
export class PreviewReformatCnvToolResultComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() uploadCnvToolResultId: number;
  @ViewChild('filterInput', { static: false })
  filterInput: ElementRef;
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();
  dialogRef: MatDialogRef<ReformatDialogComponent>;
  selectedResults: ReformatCnvToolResult[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _reformatService: PreviewReformatCnvToolResultService,
    private _matDialog: MatDialog,
    private route: ActivatedRoute
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

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        const reformatIds = [];
        for (const selectedRow of selectedResults) {
          reformatIds.push(selectedRow.reformatCnvToolResultId);
        }
        this._reformatService
          .deleteReformatByReformatIds(reformatIds)
          .subscribe(() => {
            this._reformatService.onSelectedChanged.next([]);
            this._reformatService.onTriggerDataChanged.next();
          });
      }
      this.confirmDialogRef = null;
    });
  }

  goToPreviousStep() {
    this.previousStep.next();
  }

  goToNextStep() {
    this.nextStep.next();
  }
}
