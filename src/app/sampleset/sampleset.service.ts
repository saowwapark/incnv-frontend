import { Sampleset } from './sampleset.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConstantsService } from '../constants.service';
import { map } from 'rxjs/operators';
import { PageDataSourceService } from './page-datasource.service';

@Injectable()
export class SamplesetService extends PageDataSourceService<Sampleset> {
  // must remove this line later update file-list.component, choose-file.component, upload-form.service, upload-form.component
  onSamplesetsChanged;

  onSelectedSamplesetsChanged: BehaviorSubject<Sampleset[]>;

  isDataChanged: Subject<boolean>;
  onSearchTextChanged: Subject<string>;
  onFilterChanged: Subject<string>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    super();
    this.onSelectedSamplesetsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();
    this.isDataChanged = new Subject();
  }

  countRecords(search = ''): Observable<number> {
    return this._http
      .get(`${this._constant.baseAppUrl}api/sampleset/count-samplesets`, {
        params: new HttpParams().set('search', search)
      })
      .pipe(map(res => res['payload']));
  }

  findData(
    search = '',
    sortOrder = 'asc',
    pageNumber = 0,
    pageSize = 10
  ): Observable<Sampleset[]> {
    console.log('search: ' + search);
    console.log('sortOrder: ' + sortOrder);
    console.log('pageNumber: ' + pageNumber);
    console.log('pageSize: ' + pageSize);
    return this._http
      .get(`${this._constant.baseAppUrl}api/sampleset/find-samplesets`, {
        params: new HttpParams()
          .set('search', search)
          .set('sortOrder', sortOrder)
          .set('pageNumber', pageNumber.toString())
          .set('pageSize', pageSize.toString())
      })
      .pipe(map(res => res['payload']));
  }

  /**
   *
   * @param sampleset
   */
  addSampleset(sampleset: Sampleset) {
    console.log('addSampleset');
    const url = `${this._constant.baseAppUrl}api/sampleset/add-sampleset`;
    return this._http
      .post(url, { ...sampleset })
      .pipe(map(res => res['payload']));
  }

  editSampleset(sampleset: Sampleset) {
    const url = `${this._constant.baseAppUrl}api/sampleset/edit-sampleset`;
    return this._http.put(url, sampleset).pipe(map(res => res['payload']));
  }

  deleteSampleset(samplesetId: number) {
    const url = `${this._constant.baseAppUrl}api/sampleset/${samplesetId}`;
    return this._http.delete(url).pipe(map(res => res['payload']));
  }

  // resolve(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot
  // ): Observable<any> | Promise<any> | any {
  //   return new Promise((resolve, reject) => {
  //     Promise.all([this.getSampleSets()]).then(() => {
  //       this.onSearchTextChanged.subscribe(searchText => {
  //         this.searchText = searchText;
  //         this.getSampleSets();
  //       });
  //       resolve();
  //     }, reject);
  //   });
  // }

  // getSampleSets(): Promise<any[]> {
  //   const url = `${this._constant.baseAppUrl}api/sampleset/all-samplesets`;
  //   const param = new HttpParams().set('userId', '1');

  //   return new Promise((resolve, reject) => {
  //     this._http.get(url, { params: param }).subscribe((response: any) => {
  //       this.samplesets = response.post;
  //       console.log(this.samplesets);
  //       if (this.searchText && this.searchText !== '') {
  //         this.samplesets = SearchUtils.filterArrayByString(
  //           this.samplesets,
  //           this.searchText
  //         );
  //       }
  //       this.onSamplesetsChanged.next(this.samplesets);
  //       resolve(this.samplesets);
  //     }, reject);
  //   });
  // }
  // /**
  //  * Add Sampleset
  //  *
  //  */
  // addSampleset(sampleset: Sampleset): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this._http
  //       .post('api/samplesets/' + sampleset.samplesetId, {
  //         ...sampleset
  //       })
  //       .subscribe(response => {
  //         this.getSampleSets();
  //         this._uploadFormService.onSamplesetsChanged.next(
  //           'Sampleset triggers to uploadForm.'
  //         );
  //         resolve(response);
  //       });
  //   });
  // }

  // /**
  //  * Delete Sampleset
  //  *
  //  */
  // deleteSampleset(sampleset): void {
  //   const samplesetIndex = this.samplesets.indexOf(sampleset);
  //   this.samplesets.splice(samplesetIndex, 1);
  //   this.onSamplesetsChanged.next(this.samplesets);
  //   this._uploadFormService.onSamplesetsChanged.next(
  //     'Sampleset triggers to uploadForm.'
  //   );
  // }
}
