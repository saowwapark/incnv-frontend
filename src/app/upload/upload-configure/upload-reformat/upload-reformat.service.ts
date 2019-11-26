import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConstantsService } from 'src/app/constants.service';
import { map } from 'rxjs/operators';
import { ReformatCnvToolResult } from './upload-reformat.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadReformatService {
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
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
}
