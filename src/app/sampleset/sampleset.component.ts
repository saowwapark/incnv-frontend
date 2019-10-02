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
import { Action } from './sampleset-form-dialog/dialog.action.model';

@Component({
  selector: 'app-sampleset',
  templateUrl: './sampleset.component.html',
  styleUrls: ['./sampleset.component.scss'],
  animations: myAnimations
})
export class SamplesetComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchInput', { static: false })
  searchInput: ElementRef;

  @ViewChild('filterInput', { static: true })
  filterInput: ElementRef;

  dialogRef: MatDialogRef<SamplesetFormDialogComponent>;

  hasSelectedSamplesets = false;

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

  ngOnInit(): void {
    this._samplesetService.onSelectedSamplesetsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(selectedSampleset => {
        if (selectedSampleset && selectedSampleset.length > 0) {
          this.hasSelectedSamplesets = true;
        } else {
          this.hasSelectedSamplesets = false;
        }
        console.log(
          'this.hasSelectedSamplesets: ' + this.hasSelectedSamplesets
        );
      });
  }

  ngAfterViewInit() {
    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this._samplesetService.onSearchTextChanged.next(
          this.searchInput.nativeElement.value
        );
      });

    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        const filterValue = this.filterInput.nativeElement.value;
        this._samplesetService.onFilterChanged.next(
          filterValue.trim().toLowerCase()
        );
      });
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
      panelClass: 'samplset-form-dialog',
      data: {
        action: Action.New,
        sampleset: new Sampleset()
      },
      disableClose: true
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      console.log('create new sampleset');
      console.log(response);
      if (!response) {
        return;
      }
      const updatedSampleset: Sampleset = response;

      this._samplesetService
        .addSampleset(updatedSampleset)
        .subscribe(() => this._samplesetService.isDataChanged.next());
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
}
