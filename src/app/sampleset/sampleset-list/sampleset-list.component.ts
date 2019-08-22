import { Sampleset } from './../sampleset.model';
import { SamplesetFormDialogComponent } from './../sampleset-form/sampleset-form.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil } from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';
import { SamplesetService } from '../sampleset.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sampleset-list',
  templateUrl: './sampleset-list.component.html',
  styleUrls: ['./sampleset-list.component.scss']
})
export class SamplesetListComponent implements OnInit, OnDestroy {
  samplesets: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['select', 'name', 'sampleNames', 'edit', 'delete'];
  selectedContacts: any[];
  selects: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _samplesetService: SamplesetService,
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
    this.dataSource = new FilesDataSource(this._samplesetService);
    this._samplesetService.onSamplesetsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        this.samplesets = samplesets;
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

  /**
   * Edit Sampleset
   *
   * @param contact
   */
  onEditSampleset(sampleset: Sampleset): void {
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        sampleset: sampleset,
        action: 'edit'
      }
    });

    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const actionType: string = response[0];
      const formData: FormGroup = response[1];

      switch (actionType) {
        /**
         * Save
         */
        case 'save':
          this._samplesetService.updateSampleset(formData.getRawValue());

          break;
        /**
         * Delete
         */
        case 'delete':
          this.onDeleteSampleset(sampleset);

          break;
      }
    });
  }

  /**
   * Delete TabFileMapping Configured
   */
  onDeleteSampleset(sampleset): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._samplesetService.deleteSampleset(sampleset);
      }
      this.confirmDialogRef = null;
    });
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   */
  constructor(private _samplesetService: SamplesetService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   */
  connect(): Observable<any[]> {
    return this._samplesetService.onSamplesetsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
