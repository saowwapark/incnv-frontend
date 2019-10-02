import { Sampleset } from './../sampleset.model';
import { SamplesetFormDialogComponent } from '../sampleset-form-dialog/sampleset-form-dialog.component';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { takeUntil } from 'rxjs/operators';

import { Subject, Observable } from 'rxjs';
import { SamplesetService } from '../sampleset.service';
import { SamplesetsDataSource } from '../samplesets.datasource';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Action } from '../sampleset-form-dialog/dialog.action.model';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-sampleset-list',
  templateUrl: './sampleset-list.component.html',
  styleUrls: ['./sampleset-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class SamplesetListComponent
  implements OnInit, OnDestroy, AfterViewInit {
  samplesets: Sampleset;
  dataSource: SamplesetsDataSource | null;
  displayedColumns = [
    'select',
    'name',
    'description',
    'createDate',
    'lastUpdated',
    'edit'
  ];

  selection = new SelectionModel<Sampleset>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dialogRef: MatDialogRef<SamplesetFormDialogComponent>;

  expandedElement: string | null;

  totalRecords$: Observable<number>;
  jumpPage$: Observable<number>;
  jumpPages$: Observable<number[]>;
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
    this.dataSource = new SamplesetsDataSource(
      this._samplesetService,
      this.paginator,
      this.sort
    );

    this.totalRecords$ = this.dataSource.totalRecords$;
    this.jumpPage$ = this.dataSource.jumpPage$;
    this.jumpPages$ = this.dataSource.jumpPages$;

    this._samplesetService.onSelectedSamplesetsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        if (!samplesets || samplesets.length < 1) {
          this.selection.clear();
        }
      });
  }
  ngAfterViewInit() {}
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

  updateJumpPage(goToPage: number) {
    this.dataSource.updateJumpPage(goToPage);
  }

  clearJumpPage() {
    this.dataSource.clearJumpPage();
  }

  /**
   * Edit Sampleset
   *
   * @param contact
   */
  onEditSampleset(sampleset: Sampleset): void {
    // Original data
    this.dialogRef = this._matDialog.open(SamplesetFormDialogComponent, {
      panelClass: 'sampleset-form-dialog',
      data: {
        sampleset: sampleset,
        action: Action.Edit
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      const UpdatedSampleset: Sampleset = response;

      this._samplesetService
        .editSampleset(UpdatedSampleset)
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe(() => {
          this.dataSource.loadData();
        });
    });
  }

  /************************* Collapse ************************/
  onSampleset(element) {
    if (this.expandedElement === element) {
      this.expandedElement = null;
    } else {
      this.expandedElement = element;
    }
  }

  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(sampleset =>
          this.selection.select(sampleset)
        );
    this._samplesetService.onSelectedSamplesetsChanged.next(
      this.selection.selected
    );
  }

  toggleSampleset(sampleset: Sampleset) {
    this.selection.toggle(sampleset);
    this._samplesetService.onSelectedSamplesetsChanged.next(
      this.selection.selected
    );
  }
}
