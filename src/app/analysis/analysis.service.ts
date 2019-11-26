import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { ConstantsService } from 'src/app/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from '../upload/upload-cnv-tool-result.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysis`;
  }
  // getSamplesets(): Observable<Sampleset[]> {
  //   return this._http
  //     .get(`${this._constant.baseAppUrl}/sampleset`)
  //     .pipe(map(res => res['payload']));
  // }

  getUploadCnvToolResults(
    referenceGenome,
    samplesetId
  ): Observable<UploadCnvToolResult[]> {
    return this._http
      .get(`${this.baseRouteUrl}/upload-cnv-tool-result`, {
        params: { referenceGenome: referenceGenome, samplesetId: samplesetId }
      })
      .pipe(map(res => res['payload']));
  }
}
