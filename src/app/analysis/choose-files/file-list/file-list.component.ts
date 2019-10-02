import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { UploadService } from 'src/app/upload/upload.service';
import { Subject, fromEvent, Observable, merge, BehaviorSubject } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  map
} from 'rxjs/operators';
import { SearchUtils } from 'src/app/common/search.utils';

interface ChooseFileInfo {
  fileId: number;
  fileName: string;
  cnvToolName: string;
  samplesetId: number;
  samplesetName: string;
  tags: string[];
  date: Date;
  size: string;
}

@Component({
  selector: 'file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss'],
  animations: [
    trigger('expandedElement', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
    // trigger('expandSampleset', [
    //   state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    //   state('expanded', style({height: '*'})),
    //   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
  ]
})
export class FileListComponent implements OnInit, OnDestroy {
  samplesets: Sampleset[];

  displayedColumns = [
    'select',
    'fileName',
    'cnvToolName',
    'sampleset',
    'tags',
    'date',
    'size',
    'download'
  ];
  dataSource: FilesDataSource | null;

  selection = new SelectionModel<ChooseFileInfo>(true, []);

  expandElem_sampleset: ChooseFileInfo | null;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  @ViewChild('filter', { static: false })
  filter: ElementRef;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _samplesetService: SamplesetService,
    private _uploadService: UploadService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this.dataSource = new FilesDataSource(
      this._uploadService,
      this.paginator,
      this.sort
    );

    fromEvent(this.filter.nativeElement, 'keyup')
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });

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

  getSamples(samplesetId: number) {
    let samples: string[];
    this.samplesets.forEach(sampleset => {
      if (sampleset.samplesetId === samplesetId) {
        samples = sampleset.samples;
      }
    });
    return samples;
  }

  /************************* Collapse ************************/
  onSampleset(element) {
    if (this.expandElem_sampleset === element) {
      this.expandElem_sampleset = null;
    } else {
      this.expandElem_sampleset = element;
    }
  }

  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.filteredData.forEach(row => this.selection.select(row));
  }

  /***************************  Filter **************************/
  // applyFilter(filterValue: string) {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  filterSampleset() {}

  isChooseSameSampleset() {}
}

export class FilesDataSource extends DataSource<any> {
  // Private
  private _filterChange = new BehaviorSubject('');
  private _filteredDataChange = new BehaviorSubject('');

  constructor(
    private _uploadService: UploadService,
    private _matPaginator: MatPaginator,
    private _matSort: MatSort
  ) {
    super();
    this.filteredData = this._uploadService.uploads;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  // Filtered data
  get filteredData(): any {
    return this._filteredDataChange.value;
  }

  set filteredData(value: any) {
    this._filteredDataChange.next(value);
  }

  // Filter
  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   * @returns {Observable<any[]>}
   */
  connect(): Observable<any[]> {
    const displayDataChanges = [
      this._uploadService.onUploadsChanged,
      this._matPaginator.page,
      this._filterChange,
      this._matSort.sortChange
    ];

    return merge(...displayDataChanges).pipe(
      map(() => {
        let data = this._uploadService.uploads.slice();

        data = this.filterData(data);

        this.filteredData = [...data];

        // data = this.sortData(data);

        // Grab the page's slice of data.
        const startIndex =
          this._matPaginator.pageIndex * this._matPaginator.pageSize;
        return data.splice(startIndex, this._matPaginator.pageSize);
      })
    );
  }
  /**
   * Filter data
   *
   */
  filterData(data): any {
    if (!this.filter) {
      return data;
    }
    return SearchUtils.filterArrayByString(data, this.filter);
  }

  /**
   * Disconnect
   */
  disconnect(): void {}
}
