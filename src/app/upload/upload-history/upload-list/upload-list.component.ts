import { ConfirmDialogComponent } from '../../../common/confirm-dialog/confirm-dialog.component';
import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { takeUntil } from 'rxjs/operators';

import { SamplesetService } from '../../../sampleset/sampleset.service';
import { UploadService } from '../../upload.service';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { mapIdToName } from '../../../common/map.utils';

@Component({
  selector: 'upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit, OnDestroy {
  uploads: any;
  dataSource: FilesDataSource | null;
  displayedColumns = [
    'select',
    'cnvToolName',
    'fileName',
    'samplesetName',
    'tags',
    'date',
    'size',
    'file',
    'edit',
    'delete'
  ];
  selectedContacts: any[];
  selects: {};
  dialogRef: any;
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _uploadsService: UploadService,
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
    this.dataSource = new FilesDataSource(this._uploadsService);

    this._uploadsService.onUploadsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(uploads => {
        this.uploads = uploads;

        this.selects = {};
        uploads.map(upload => {
          this.selects[upload.id] = false;
        });
      });

    this._uploadsService.onSelectedUploadsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedContacts => {
        for (const id in this.selects) {
          if (!this.selects.hasOwnProperty(id)) {
            continue;
          }

          this.selects[id] = selectedContacts.includes(id);
        }
        this.selectedContacts = selectedContacts;
      });

    this._uploadsService.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this._uploadsService.deselectUploads();
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
  map = (id: number, list: any[]): string => {
    return mapIdToName(id, list);
  };

  /**
   * Delete upload
   */
  deleteContact(upload): void {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._uploadsService.deleteUpload(upload);
      }
      this.confirmDialogRef = null;
    });
  }

  /**
   * On selected change
   *
   */
  onSelectedChange(uploadId): void {
    this._uploadsService.toggleSelectedUpload(uploadId);
  }
}

export class FilesDataSource extends DataSource<any> {
  /**
   * Constructor
   *
   */
  constructor(private _uploadsService: UploadService) {
    super();
  }

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   */
  connect(): Observable<any[]> {
    return this._uploadsService.onUploadsChanged;
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}