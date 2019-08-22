import { Sampleset } from './sampleset.model';
import { SamplesetService } from './sampleset.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SamplesetFormDialogComponent } from './sampleset-form/sampleset-form.component';

@Component({
  selector: 'sampleset',
  templateUrl: './sampleset.component.html',
  styleUrls: ['./sampleset.component.scss']
})
export class SamplesetComponent implements OnInit {
  dialogRef: any;
  searchInput: FormControl;

  samplesets: Sampleset[];

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _matDialog: MatDialog,
    private _samplesetService: SamplesetService
  ) {
    this.searchInput = new FormControl('');
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.searchInput.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchText => {
        this._samplesetService.onSearchTextChanged.next(searchText);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New Sampleset
   */
  newSampleset(): void {
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
      this._samplesetService.updateSampleset(response.getRawValue());
    });
  }
}
