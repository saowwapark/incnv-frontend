import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import {
  CnvTool,
  IndividualSampleConfig,
  MultipleSampleConfig
} from '../../analysis.model';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConstantsService } from 'src/app/shared/services/constants.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AnalysisProcessService {
  baseRouteUrl: string;
  onIndividualConfigChanged: BehaviorSubject<IndividualSampleConfig>;
  onMultipleConfigChanged: BehaviorSubject<MultipleSampleConfig>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
    this.onIndividualConfigChanged = new BehaviorSubject({});
    this.onMultipleConfigChanged = new BehaviorSubject({});
  }

  getIndividualData(
    config: IndividualSampleConfig
  ): Observable<[CnvTool[], CnvTool]> {
    const options = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json'
      // }),
      params: {
        referenceGenome: config.referenceGenome,
        chromosome: config.chromosome,
        cnvType: config.cnvType,
        sample: config.sample,
        uploadCnvToolResults: JSON.stringify(config.uploadCnvToolResults)
      }
    };
    // actual url must not be longer than 2000 characters.
    return this._http
      .get(`${this.baseRouteUrl}/individual-sample`, options)
      .pipe(map(res => res['payload']));
  }

  getMulitpleData(
    config: MultipleSampleConfig
  ): Observable<[CnvTool[], CnvTool]> {
    const options = {
      // headers: new HttpHeaders({
      //   'Content-Type': 'application/json'
      // }),
      params: {
        referenceGenome: config.referenceGenome,
        chromosome: config.chromosome,
        cnvType: config.cnvType,
        samples: config.samples,
        uploadCnvToolResult: JSON.stringify(config.uploadCnvToolResult)
      }
    };
    // actual url must not be longer than 2000 characters.
    return this._http
      .get(`${this.baseRouteUrl}/multiple-analysis`, options)
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
