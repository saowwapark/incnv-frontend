import { UploadReformatDialogComponent } from './upload-reformat-dialog/upload-reformat-dialog.component';
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

import {
  MatDialogRef,
  MatDialog,
  MatDialogConfig
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { ReformatCnvToolResult } from './upload-reformat.model';
import { UploadReformatService } from './upload-reformat.service';
import { myAnimations } from 'src/app/animations';

@Component({
  selector: 'app-upload-reformat',
  templateUrl: './upload-reformat.component.html',
  styleUrls: ['./upload-reformat.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: myAnimations
})
export class UploadReformatComponent
  implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() uploadCnvToolResultId: number;
  @ViewChild('filterInput', { static: false })
  filterInput: ElementRef;
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();
  dialogRef: MatDialogRef<UploadReformatDialogComponent>;
  reformatCnvToolResults: ReformatCnvToolResult[];
  selectedResults: ReformatCnvToolResult[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _uploadReformatService: UploadReformatService,
    private _matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this.reformatCnvToolResults = [];
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this._uploadReformatService.onTriggerDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._uploadReformatService
          .getReformatCnvToolResults(this.uploadCnvToolResultId)
          .subscribe(updatedReformatCnvToolResults => {
            this.reformatCnvToolResults = updatedReformatCnvToolResults;
          });
      });

    this._uploadReformatService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedResults => {
        this.selectedResults = selectedResults;
      });
  }

  ngOnChanges(): void {
    this._uploadReformatService
      .getReformatCnvToolResults(this.uploadCnvToolResultId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(reformatCnvToolResults => {
        this.reformatCnvToolResults = reformatCnvToolResults;
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
        this._uploadReformatService.onSearchTextChanged.next(
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
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;

    // Original data
    this.dialogRef = this._matDialog.open(UploadReformatDialogComponent, {
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
    this._uploadReformatService.onSelectedChanged.next([]);
  }
  onSubmitAllSelected(selectedResults) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    // let rowNames = '';
    // selectedResults.forEach((selectedRow: , index) => {
    //   if (index === 0) {
    //     rowNames += selectedRow.samplesetName;
    //   } else {
    //     rowNames += `, ${selectedRow.samplesetName}`;
    //   }
    // });
    // this.confirmDialogRef.componentInstance.confirmMessage =
    //   'Are you sure you want to delete?' + rowNames;

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(() => {
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
