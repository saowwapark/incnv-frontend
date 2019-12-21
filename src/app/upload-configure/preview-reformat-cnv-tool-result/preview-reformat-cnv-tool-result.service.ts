import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/constants.service';
import { map } from 'rxjs/operators';
import { ReformatCnvToolResult } from './reformat-cnv-tool-result.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviewReformatCnvToolResultService {
  onResultsChanged: BehaviorSubject<ReformatCnvToolResult[]>;
  onSelectedChanged: BehaviorSubject<ReformatCnvToolResult[]>;
  onTriggerDataChanged: BehaviorSubject<void>;
  onSearchTextChanged: Subject<string>;

  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onResultsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/reformat-cnv-tool-results`;
  }

  // getReformatCnvToolResults(
  //   uploadCnvToolResultId: number
  // ): Observable<ReformatCnvToolResult[]> {
  //   return this._http
  //     .get(`${this.baseRouteUrl}/${uploadCnvToolResultId}`)
  //     .pipe(map(res => res['payload']));
  // }

  getReformatCnvToolResults(
    uploadCnvToolResultId: number,
    sort: string,
    order: string,
    pageNumber: number,
    pageSize: number
  ): Observable<{ items: ReformatCnvToolResult[]; totalCount: number }> {
    return this._http
      .get(
        `${this.baseRouteUrl}/upload-cnv-tool-results/${uploadCnvToolResultId}`,
        {
          params: {
            sort: sort,
            order: order,
            pageNumber: String(pageNumber + 1),
            pageSize: String(pageSize)
          }
        }
      )

      .pipe(map(res => res['payload']));
  }

  deleteReformatByUploadId(uploadCnvToolResultId: number) {
    return this._http.delete(`${this.baseRouteUrl}`, {
      params: { uploadCnvToolResultId: String(uploadCnvToolResultId) }
    });
  }

  /** Records */
  deleteReformatByReformatIds(reformatCnvToolResultIds: number[]) {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: {
        reformatCnvToolResultIds: reformatCnvToolResultIds
      }
    };
    return this._http.delete(`${this.baseRouteUrl}`, options);
  }
  editReformatCnvToolResult(reformatCnvToolResult: ReformatCnvToolResult) {
    return this._http.put(
      `${this.baseRouteUrl}/upload-cnv-tool-results/${reformatCnvToolResult.reformatCnvToolResultId}`,
      reformatCnvToolResult
    );
  }
}
