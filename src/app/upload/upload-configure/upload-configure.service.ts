import { UploadReformatService } from './upload-reformat/upload-reformat.service';
import { Injectable } from '@angular/core';
import { ReformatCnvToolResult } from './upload-reformat/upload-reformat.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UploadCnvToolResult } from '../upload-cnv-tool-result.model';
import { UploadFormService } from './upload-form/upload-form.service';

@Injectable({
  providedIn: 'root'
})
export class UploadConfigureService {
  onUploadReformatsChanged: BehaviorSubject<ReformatCnvToolResult[]>;
  onUploadFormClearTriggered: Subject<any>;
  uploadCnvToolResultId: number;

  constructor(
    private _uploadReformatService: UploadReformatService,
    private _uploadFormService: UploadFormService
  ) {
    this.onUploadReformatsChanged = new BehaviorSubject([]);
    this.onUploadFormClearTriggered = new Subject();
  }

  getUploadReformat() {
    this._uploadReformatService
      .getReformatCnvToolResults(this.uploadCnvToolResultId)
      .subscribe((reformatCnvToolResults: ReformatCnvToolResult[]) => {
        this.onUploadReformatsChanged.next(reformatCnvToolResults);
      });
  }

  deleteUploadConfigure() {
    this._uploadFormService
      .deleteUploadCnvToolResult(this.uploadCnvToolResultId)
      .subscribe();

    this._uploadReformatService
      .deleteReformatCnvToolResults(this.uploadCnvToolResultId)
      .subscribe();

    this.onUploadReformatsChanged.next([]);
    this.onUploadFormClearTriggered.next();
  }

  addUploadForm(uploadCnvToolResult: UploadCnvToolResult, file: File) {
    this._uploadFormService
      .addUploadCnvToolResult(uploadCnvToolResult, file)
      .subscribe(uploadCnvToolResultId => {
        this.uploadCnvToolResultId = uploadCnvToolResultId;
        this.getUploadReformat();
      });
  }

  // addUploadForm(uploadCnvToolResult: UploadCnvToolResult, file: File) {
  //   this.getUploadReformat();
  // }

  clearDataBefore() {
    this.onUploadReformatsChanged.next([]);
    this.onUploadFormClearTriggered.next();
  }
}
