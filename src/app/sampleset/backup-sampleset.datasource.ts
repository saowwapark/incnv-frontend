import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, BehaviorSubject, of, Subject, merge } from 'rxjs';
import { SamplesetService } from './sampleset.service';
import { Sampleset } from './sampleset.model';
import { catchError, finalize, tap, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SearchUtils } from '../common/search.utils';
import { PageDataSource } from './page-datasource';

export class SamplesetsDataSourceBackup extends DataSource<Sampleset> {
  // Data Source
  private dataSubject = new BehaviorSubject<Sampleset[]>([]);
  private fetchedData: Sampleset[];

  // Loading Progress Bar
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  // Unsubscribe
  private _unsubscribeAll: Subject<any> = new Subject();

  // Page
  private _totalRecordsSubject: Subject<number> = new Subject();
  public totalRecords$ = this._totalRecordsSubject.asObservable();

  private _jumpPageSubject: Subject<number> = new Subject();
  public jumpPage$ = this._jumpPageSubject.asObservable();

  private _jumpPagesSubject: Subject<number[]> = new Subject();
  public jumpPages$ = this._jumpPagesSubject.asObservable();

  // Search
  public sortDirection = 'asc';
  private searchText = '';
  private filter = '';

  constructor(
    private _service: SamplesetService,
    private _paginator: MatPaginator,
    private _sort: MatSort,
    private _jumpPageRange = 5
  ) {
    super();
    this.loadData();

    this._service.onSearchTextChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(searchText => {
        console.log('searchText: ' + searchText);
        this.searchText = searchText;
      });

    this._service.onFilterChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(filter => {
        console.log('filter: ' + filter);
        this.filter = filter;
      });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get data(): Sampleset[] {
    return this.dataSubject.getValue();
  }
  get jumpPageRange() {
    return this._jumpPageRange;
  }

  set jumpPageRange(value: number) {
    this._jumpPageRange = value;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  private fetchData(): Observable<Sampleset[]> {
    this.loadingSubject.next(true);

    return this._service
      .findData(
        this.searchText,
        this.sortDirection,
        this._paginator.pageIndex,
        this._paginator.pageSize
      )
      .pipe(
        tap(data => (this.fetchedData = data)),
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      );
  }
  private createJumpPages(totalRecords) {
    const recordsPerPage = this._paginator.pageSize;
    const totalPages = Math.trunc(totalRecords / recordsPerPage);

    if (totalPages / this.jumpPageRange > 0) {
      const jumpPages = [];
      if (this.jumpPageRange !== 1) {
        jumpPages.push(1);
      }
      let index = 1;
      let pageAt = 0;
      while (pageAt <= totalPages) {
        pageAt = index * this.jumpPageRange;
        jumpPages.push(pageAt);
        index++;
        pageAt = pageAt + this.jumpPageRange;
      }
      this._jumpPagesSubject.next(jumpPages);
    }
  }

  private createPageCount() {
    this._service.countRecords(this.searchText).subscribe(totalRecords => {
      this._totalRecordsSubject.next(totalRecords);
      this.createJumpPages(totalRecords);
    });
  }

  /**
   * Filter data
   *
   */
  private filterData(data): any {
    if (!this.filter) {
      return data;
    }
    return SearchUtils.filterArrayByString(data, this.filter);
  }

  private sortData(data: any[]): any[] {
    console.log('--------- sortData ----------');
    console.log('MatSort.active: ' + this._sort.active);
    console.log('MatSort.direction: ' + this._sort.direction);
    console.log('MatSort');
    console.log(this._sort);

    const copiedData = data.slice();
    if (!this._sort.active || this._sort.direction === '') {
      return copiedData;
    }
    console.log('Sort Data');

    return copiedData.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      [propertyA, propertyB] = [a[this._sort.active], b[this._sort.active]];
      if (typeof propertyB === 'number' && typeof propertyA === 'number') {
        return (
          (propertyB - propertyA) * (this._sort.direction === 'asc' ? 1 : -1)
        );
      } else {
        return (
          ((propertyA as string).toLowerCase() <
          (propertyB as string).toLowerCase()
            ? -1
            : 1) * (this._sort.direction === 'asc' ? 1 : -1)
        );
      }

      // if (isNaN(+propertyB)) {
      //   valueB = (propertyB as string).toLowerCase();
      // } else {
      //   valueB = +propertyB;
      // }
      // const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      // const valueB = isNaN(+propertyB) ? propertyB : +propertyB;
      // return (
      //   (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1)
      // );
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Connect function called by the table to retrieve one stream containing the data to render.
   *
   */
  connect(collectionViewer: CollectionViewer): Observable<Sampleset[]> {
    console.log('Connecting data source');

    const dataChanges = [
      this._service.onSearchTextChanged,
      this._service.isDataChanged,
      this._paginator.page
    ];
    const displayChanges = [
      this._service.onFilterChanged,
      this._sort.sortChange
    ];

    merge(...dataChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => this.loadData())
      )
      .subscribe();

    merge(...displayChanges)
      .pipe(
        takeUntil(this._unsubscribeAll),
        tap(() => this.displayData())
      )
      .subscribe();
    return this.dataSubject.asObservable();
  }

  displayData(): void {
    let data = this.fetchedData;
    data = this.filterData(data);
    data = this.sortData(data);
    this.dataSubject.next(data);
  }

  loadData(): void {
    this.loadingSubject.next(true);
    this.fetchData()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(data => {
        data = this.filterData(data);
        data = this.sortData(data);
        this.createPageCount();
        this.dataSubject.next(data);
      });
  }

  updateJumpPage(goToPage: number): void {
    this._jumpPageSubject.next(goToPage);
    this._paginator.pageIndex = goToPage - 1;
    this.loadData();
  }

  clearJumpPage(): void {
    this._jumpPageSubject.next(null);
  }

  /**
   * Disconnect
   */
  disconnect(collectionViewer: CollectionViewer): void {
    console.log('Disconnecting Data Source');
    this._totalRecordsSubject.complete();
    this._jumpPageSubject.complete();
    this._jumpPagesSubject.complete();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
