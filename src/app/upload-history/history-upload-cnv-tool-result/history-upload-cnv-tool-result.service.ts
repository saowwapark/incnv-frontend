import { Injectable } from '@angular/core';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryUploadCnvToolResultService {
  baseRouteUrl: string;
  onTriggerDataChanged: BehaviorSubject<void>;
  onSelectedChanged: BehaviorSubject<UploadCnvToolResult[]>;
  onUploadCnvToolResultsChanged: BehaviorSubject<UploadCnvToolResult[]>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onUploadCnvToolResultsChanged = new BehaviorSubject([]);

    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/upload-cnv-tool-results`;
  }

  deleteUploadCnvToolResult(uploadCnvToolResultId: number) {
    return this._http.delete(`${this.baseRouteUrl}/${uploadCnvToolResultId}`);
  }

  getUploadCnvToolResults(): Observable<UploadCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}`)
      .pipe(map(res => res['payload']));
  }
}
