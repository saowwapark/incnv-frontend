// import { Sampleset } from './sampleset.model';
// import { BehaviorSubject, Subject, Observable } from 'rxjs';
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { ConstantsService } from '../constants.service';
// import { map, tap } from 'rxjs/operators';
// import { IdAndName } from '../shared/models/id-and-name.model';

// @Injectable()
// export class SamplesetService {
//   // must remove this line later update file-list.component, choose-file.component, upload-form.service, upload-form.component
//   onSamplesetsChanged: BehaviorSubject<Sampleset[]>;
//   onSelectedChanged: BehaviorSubject<Sampleset[]>;
//   onTriggerDataChanged: BehaviorSubject<void>;
//   onSearchTextChanged: Subject<string>;

//   baseRouteUrl: string;

//   constructor(private _http: HttpClient, private _constant: ConstantsService) {
//     this.onSelectedChanged = new BehaviorSubject([]);
//     this.onSamplesetsChanged = new BehaviorSubject([]);
//     this.onSearchTextChanged = new Subject();
//     this.onTriggerDataChanged = new BehaviorSubject(null);
//     this.baseRouteUrl = `${this._constant.baseAppUrl}/api/sampleset`;
//   }

//   /**
//    *
//    * @param sampleset
//    */
//   addSampleset(sampleset: Sampleset) {
//     console.log('addSampleset');
//     const url = `${this.baseRouteUrl}`;
//     return this._http
//       .post(url, { ...sampleset })
//       .pipe(tap(() => this.onTriggerDataChanged.next()));
//   }

//   editSampleset(sampleset: Sampleset) {
//     const samplesetId = sampleset.samplesetId;
//     const url = `${this.baseRouteUrl}/${samplesetId}`;
//     return this._http
//       .put(url, sampleset)
//       .pipe(tap(() => this.onTriggerDataChanged.next()));
//   }

//   deleteSampleset(samplesetId: number) {
//     const url = `${this.baseRouteUrl}/${samplesetId}`;
//     return this._http.delete(url);
//   }

//   getIdAndNames(): Observable<IdAndName[]> {
//     return this._http
//       .get(`${this._constant.baseAppUrl}/api/samplesets/id-names`)
//       .pipe(map(res => res['payload']));
//   }

//   getSamplesets(): Observable<Sampleset[]> {
//     return this._http
//       .get(`${this._constant.baseAppUrl}/api/samplesets`)
//       .pipe(map(res => res['payload']));
//   }

//   // countRecords(search = ''): Observable<number> {
//   //   return this._http
//   //     .get(`${this.baseRouteUrl}/count-samplesets`, {
//   //       params: new HttpParams().set('search', search)
//   //     })
//   //     .pipe(map(res => res['payload']));
//   // }

//   // findData(
//   //   search = '',
//   //   sortOrder = 'asc',
//   //   pageNumber = 0,
//   //   pageSize = 10
//   // ): Observable<Sampleset[]> {
//   //   console.log('search: ' + search);
//   //   console.log('sortOrder: ' + sortOrder);
//   //   console.log('pageNumber: ' + pageNumber);
//   //   console.log('pageSize: ' + pageSize);
//   //   return this._http
//   //     .get(`${this.baseRouteUrl}/find-samplesets`, {
//   //       params: new HttpParams()
//   //         .set('search', search)
//   //         .set('sortOrder', sortOrder)
//   //         .set('pageNumber', pageNumber.toString())
//   //         .set('pageSize', pageSize.toString())
//   //     })
//   //     .pipe(map(res => res['payload']));
//   // }
// }
