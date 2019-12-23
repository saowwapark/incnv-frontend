import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisConfigureService {
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
  }

  getUploadCnvToolResults(
    referenceGenome,
    samplesetId
  ): Observable<UploadCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}/upload-cnv-tool-results`, {
        params: {
          referenceGenome: referenceGenome,
          samplesetId: samplesetId
        }
      })
      .pipe(map(res => res['payload']));
  }
}
