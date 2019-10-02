import { UploadFormService } from './upload-form.service';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { IdAndName } from './../../../types/common';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'src/app/constants.service';
import { observable, Observable } from 'rxjs';
import { tap, map, take, first, switchMap } from 'rxjs/operators';

@Injectable()
export class UploadFormResolver implements Resolve<any> {
  samplesets: IdAndName[];
  tapfileMapping: IdAndName[];

  constructor(
    private _httpClient: HttpClient,
    private _uploadFormService: UploadFormService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<Observable<[(IdAndName[]), (IdAndName[])]>> {
    const routerObservable = this._uploadFormService.getSamplesets().pipe(
      first(),
      switchMap(samplesets =>
        this._uploadFormService.getTapFileMappings().pipe(
          first(),
          map<IdAndName[], [IdAndName[], IdAndName[]]>(tapFileMappings => [
            samplesets,
            tapFileMappings
          ])
        )
      )
    );
    return new Promise((resolve, reject) => {
      resolve(routerObservable);
    });
  }
}
