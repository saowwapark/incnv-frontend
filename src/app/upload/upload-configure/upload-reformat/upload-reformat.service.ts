import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/constants.service';
import { map } from 'rxjs/operators';
import { ReformatCnvToolResult } from './upload-reformat.model';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadReformatService {
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
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/reformat-cnv-tool-result`;
  }

  getReformatCnvToolResults(
    uploadCnvToolResultId: number
  ): Observable<ReformatCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}/${uploadCnvToolResultId}`)
      .pipe(map(res => res['payload']));
  }

  deleteReformatCnvToolResults(uploadCnvToolResultId: number) {
    return this._http.delete(`${this.baseRouteUrl}/${uploadCnvToolResultId}`);
  }

  editReformatCnvToolResult(reformatCnvToolResult: ReformatCnvToolResult) {
    return this._http.put(`${this.baseRouteUrl}`, reformatCnvToolResult);
  }

  addReformatCnvToolResult(reformatCnvToolResult: ReformatCnvToolResult) {
    return this._http.post(`${this.baseRouteUrl}`, reformatCnvToolResult);
  }
}
