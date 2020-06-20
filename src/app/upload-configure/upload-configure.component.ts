import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

import { UploadFormService } from './configure-upload-cnv-tool-result/upload-form/upload-form.service';
import { merge, Observable } from 'rxjs';
import { ReformatCnvToolResultService } from '../reformat-cnv-tool-result/reformat-cnv-tool-result.service';

@Component({
  selector: 'upload-configure',
  templateUrl: './upload-configure.component.html',
  styleUrls: ['./upload-configure.component.scss']
})
export class UploadConfigureComponent {
  uploadCnvToolResultId: number;
  constructor(
    private _reformatService: ReformatCnvToolResultService,
    private _uploadFormService: UploadFormService
  ) {}

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  goToReformatStep(uploadCnvToolResultId) {
    this.uploadCnvToolResultId = uploadCnvToolResultId;
    this.stepper.next();
  }

  goToUploadStep() {
    this.deleteConfigure().subscribe(() => {
      this.stepper.previous();
    });
  }

  goToSuccessStep() {
    this.stepper.next();
  }

  deleteConfigure(): Observable<any> {
    const deleteUpload$ = this._uploadFormService.deleteUploadCnvToolResult(
      this.uploadCnvToolResultId
    );
    return deleteUpload$;
    // // delete cascade
    // const deleteReformat$ = this._reformatService.deleteReformatByUploadId(
    //   this.uploadCnvToolResultId
    // );
    // return merge(deleteUpload$, deleteReformat$);
  }

  uploadAgain() {
    this.uploadCnvToolResultId = undefined;
    this.stepper.reset();
  }
}
