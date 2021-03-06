import { DgvVariant } from './../../analysis.model';
import {
  CnvGroup,
  IndividualSampleConfig,
  MultipleSampleConfig,
  DgvAnnotation
} from '../../analysis.model';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  throwError,
  TimeoutError
} from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, timeout, catchError, shareReplay } from 'rxjs/operators';
import { ConstantsService } from 'src/app/services/constants.service';

@Injectable()
export class AnalysisProcessService {
  baseRouteUrl: string;
  onSelectedCnvChanged: Subject<CnvInfo[]>;
  onSelectedCnv: Subject<CnvInfo>;
  onIndividualSampleConfigChanged: BehaviorSubject<IndividualSampleConfig>;
  onMultipleSampleConfigChanged: BehaviorSubject<MultipleSampleConfig>;

  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysises`;
    this.onSelectedCnv = new Subject();
    this.onSelectedCnvChanged = new Subject();
    this.onIndividualSampleConfigChanged = new BehaviorSubject({});
    this.onMultipleSampleConfigChanged = new BehaviorSubject({});
  }

  getIndividualSampleData(
    config: IndividualSampleConfig
  ): Observable<[CnvGroup[], CnvGroup]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data = {
      referenceGenome: config.referenceGenome,
      chromosome: config.chromosome,
      cnvType: config.cnvType,
      sample: config.sample,
      uploadCnvToolResults: config.uploadCnvToolResults
    };
    // actual http get url must not be longer than 2000 characters.
    return this._http
      .post(`${this.baseRouteUrl}/individual-sample`, data, {
        headers
      })
      .pipe(
        shareReplay({ refCount: true, bufferSize: 1 }),
        timeout(600000),
        map(res => res['payload']),
        catchError((error: unknown) => {
          // Error...
          // Handle 'timeout over' error
          if (error instanceof TimeoutError) {
            return throwError('Timeout Exception 600000ms');
          }

          // Return other errors
          return throwError(error);
        })
      );
  }

  getMultipleSampleData(
    config: MultipleSampleConfig
  ): Observable<[CnvGroup[], CnvGroup]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const data = {
      referenceGenome: config.referenceGenome,
      chromosome: config.chromosome,
      cnvType: config.cnvType,
      samples: config.samples,
      uploadCnvToolResult: config.uploadCnvToolResult
    };
    // actual http get url must not be longer than 2000 characters.
    return this._http
      .post(`${this.baseRouteUrl}/multiple-sample`, data, {
        headers
      })
      .pipe(
        map(res => res['payload']),
        shareReplay({ refCount: true, bufferSize: 1 })
      );
  }

  getDgvVariants(
    referenceGenome: string,
    chromosome: string
  ): Observable<DgvVariant[]> {
    const url = `${this.baseRouteUrl}/dgvs`;
    const options = {
      params: {
        referenceGenome,
        chromosome
      }
    };
    return this._http
      .get(url, options)
      .pipe(
        map(
          res => res['payload'],
          shareReplay({ refCount: true, bufferSize: 1 })
        )
      );
  }

  getCnvInfos(cnvInfos: CnvInfo[]) {
    return (
      this._http
        // .get(`${this.baseRouteUrl}/final-cnv-annotations`, {
        //   params: { cnvs: cnvs.toString() }
        // })
        .post(`${this.baseRouteUrl}/cnv-infos`, [...cnvInfos])
        .pipe(
          map(res => res['payload']),
          shareReplay({ refCount: true, bufferSize: 1 })
        )
    );
  }

  getCnvInfo(cnvInfo: CnvInfo) {
    return (
      this._http
        // .get(`${this.baseRouteUrl}/final-cnv-annotations`, {
        //   params: { cnvs: cnvs.toString() }
        // })
        .post(`${this.baseRouteUrl}/cnv-info`, { ...cnvInfo })
        .pipe(
          map(res => res['payload']),
          shareReplay({ refCount: true, bufferSize: 1 })
        )
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
