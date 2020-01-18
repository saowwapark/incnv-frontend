import { CnvTool, IndividualSampleConfig } from './../analysis.model';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';

@Injectable({
  providedIn: 'root'
})
export class AnalysisProcessService {
  baseRouteUrl: string;
  onIndividualConfigChanged: BehaviorSubject<IndividualSampleConfig>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
    this.onIndividualConfigChanged = new BehaviorSubject({});
  }

  getAllCnvToolDetails(
    referenceGenome,
    uploadCnvToolResults,
    sample,
    chromosome,
    cnvType
  ): Observable<CnvTool[]> {
    const options = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json'
      // }),
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

  updateCnvInfos(cnvInfos: CnvInfo[]) {
    return (
      this._http
        // .get(`${this.baseRouteUrl}/final-cnv-annotations`, {
        //   params: { cnvs: cnvs.toString() }
        // })
        .post(`${this.baseRouteUrl}/cnv-infos`, [...cnvInfos])
        .pipe(map(res => res['payload']))
    );
  }

  updateCnvInfo(cnvInfo: CnvInfo) {
    return (
      this._http
        // .get(`${this.baseRouteUrl}/final-cnv-annotations`, {
        //   params: { cnvs: cnvs.toString() }
        // })
        .post(`${this.baseRouteUrl}/cnv-info`, { ...cnvInfo })
        .pipe(map(res => res['payload']))
    );
  }

  downloadCnvInfos(cnvInfos: CnvInfo[]) {
    return this._http
      .post(`${this.baseRouteUrl}/download/cnv-infos`, [...cnvInfos], {
        responseType: 'text'
      })
      .pipe(
        tap(data => {
          const blob = new Blob([data], { type: 'text/plain; charset=utf-8' });
          const url = window.URL.createObjectURL(blob);
          window.open(url);
        })
      );
  }
}
