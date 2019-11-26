import { Injectable } from '@angular/core';
import { UploadCnvToolResult } from '../../upload-cnv-tool-result.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsService } from 'src/app/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UploadHistoryUploadCnvToolResultService {
  baseRouteUrl: string;
  onTriggerDataChanged: BehaviorSubject<void>;
  onSelectedChanged: BehaviorSubject<UploadCnvToolResult[]>;
  onUploadCnvToolResultsChanged: BehaviorSubject<UploadCnvToolResult[]>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.onTriggerDataChanged = new BehaviorSubject(null);
    this.onSelectedChanged = new BehaviorSubject([]);
    this.onUploadCnvToolResultsChanged = new BehaviorSubject([]);

    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/upload-cnv-tool-result`;
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
