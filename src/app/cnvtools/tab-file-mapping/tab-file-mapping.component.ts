import { TabFileMappingService } from './tab-file-mapping.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { TabFileMappingFormDialogComponent } from './tab-file-mapping-form/tab-file-mapping-form.component';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-tab-file-mapping',
  templateUrl: './tab-file-mapping.component.html',
  styleUrls: ['./tab-file-mapping.component.scss']
})
export class TabFileMappingComponent implements OnInit {
  dialogRef: any;
  searchInput: FormControl;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _matDialog: MatDialog,
    private _fileMappingService: TabFileMappingService
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
        this._fileMappingService.onSearchTextChanged.next(searchText);
      });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New upload
   */
  newTabFileMapping(): void {
    this.dialogRef = this._matDialog.open(TabFileMappingFormDialogComponent, {
      panelClass: 'contact-form-dialog',
      data: {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed().subscribe((response: FormGroup) => {
      if (!response) {
        return;
      }
      this._fileMappingService.updateTabFileMapping(
        response.getRawValue()
      );
    });
  }
}
