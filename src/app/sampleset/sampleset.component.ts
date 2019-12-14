import { Sampleset } from './sampleset.model';
import { SamplesetService } from './sampleset.service';
import { myAnimations } from 'src/app/animations';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig
} from '@angular/material/dialog';
import { SamplesetFormDialogComponent } from './sampleset-form-dialog/sampleset-form-dialog.component';
import { DialogAction } from '../shared/models/dialog.action.model';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-sampleset',
  templateUrl: './sampleset.component.html',
  styleUrls: ['./sampleset.component.scss'],
  animations: myAnimations
})
export class SamplesetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('filterInput', { static: false })
  filterInput: ElementRef;

  dialogRef: MatDialogRef<SamplesetFormDialogComponent>;
  samplesets: Sampleset[];
  selectedSamplesets: Sampleset[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;
  private _unsubscribeAll: Subject<any>;

  constructor(
    public samplesetService: SamplesetService,
    public _matDialog: MatDialog,
    private route: ActivatedRoute
  ) {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.samplesets = this.route.snapshot.data['samplesets'];
    this.samplesetService.onTriggerDataChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.samplesetService.getSamplesets().subscribe(updatedSamplesets => {
          this.samplesets = updatedSamplesets;
        });
      });

    this.samplesetService.onSelectedChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamplesets => {
        this.selectedSamplesets = selectedSamplesets;
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
        this.samplesetService.onSearchTextChanged.next(
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
  onAddSampleset(): void {
    const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;

    // Original data
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        action: DialogAction.New,
        sampleset: new Sampleset()
      },
      disableClose: true
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const updatedSampleset: Sampleset = response;

      this.samplesetService.addSampleset(updatedSampleset).subscribe();
    });
  }
  onDelselectedAll() {
    this.samplesetService.onSelectedChanged.next([]);
  }
  onSubmitAllSelected(selectedSamplesets) {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false
    });

    let rowNames = '';
    selectedSamplesets.forEach((selectedSampleset, index) => {
      if (index === 0) {
        rowNames += selectedSampleset.samplesetName;
      } else {
        rowNames += `, ${selectedSampleset.samplesetName}`;
      }
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?' + rowNames;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        selectedSamplesets.forEach(selectedRow => {
          this.samplesetService
            .deleteSampleset(selectedRow.samplesetId)
            .subscribe(() => {
              this.samplesetService.onSelectedChanged.next([]);
              this.samplesetService.onTriggerDataChanged.next();
            });
        });
      }
      this.confirmDialogRef = null;
    });
  }
}
