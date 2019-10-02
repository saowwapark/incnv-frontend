import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { IdAndName } from './../../../types/common';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from 'src/app/constants.service';
import { observable, Observable, Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadFormService {
  samplesets: IdAndName[];
  tapfileMapping: IdAndName[];

  onSamplesetsChanged: BehaviorSubject<string>;
  onTapFileMappingChanged: BehaviorSubject<string>;
  constructor(
    private _httpClient: HttpClient,
    private _constant: ConstantsService
  ) {
    this.onSamplesetsChanged = new BehaviorSubject('trigger message');
    this.onTapFileMappingChanged = new BehaviorSubject('trigger message');
  }

  getSamplesets(): Observable<IdAndName[]> {
    return this._httpClient.get('api/samplesets-id-name') as Observable<
      IdAndName[]
    >;
  }

  getTapFileMappings(): Observable<IdAndName[]> {
    return this._httpClient.get('api/tab-fileMappings-id-name') as Observable<
      IdAndName[]
    >;
  }
}
