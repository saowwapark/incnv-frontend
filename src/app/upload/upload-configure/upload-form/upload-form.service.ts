import { Injectable } from '@angular/core';
import { IdAndName } from '../../../shared/models/id-and-name.model';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'src/app/constants.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from '../../upload-cnv-tool-result.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFormService {
  samplesets: IdAndName[];
  tapfileMapping: IdAndName[];
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/upload-cnv-tool-result`;
  }

  addUploadCnvToolResult(
    uploadCnvToolResult: UploadCnvToolResult,
    file: File
  ): Observable<number> {
    console.log('addUpload');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadCnvToolResult', JSON.stringify(uploadCnvToolResult));

    return this._http
      .post(`${this.baseRouteUrl}`, formData)
      .pipe(map(res => res['payload'])); // return 'let uploadCnvToolResultId: number'
  }

  deleteUploadCnvToolResult(uploadCnvToolResultId: number) {
    return this._http.delete(`${this.baseRouteUrl}/${uploadCnvToolResultId}`);
  }
}
