import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisProcessService {
  baseRouteUrl: string;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
  }

  getAllCnvToolDetails(
    referenceGenome,
    uploadCnvToolResults,
    sample,
    chromosome,
    cnvType
  ): Observable<UploadCnvToolResult[]> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: {
        referenceGenome: referenceGenome,
        chromosome: chromosome,
        cnvType: cnvType,
        sample: sample,
        uploadCnvToolResults: JSON.stringify(uploadCnvToolResults)
      }
    };
    // actual url must not be longer than 2000 characters.
    return this._http
      .get(`${this.baseRouteUrl}/all-cnv-tool-details`, options)
      .pipe(map(res => res['payload']));
  }
}
