import { UploadConfigureService } from './upload-configure.service';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'upload-configure',
  templateUrl: './upload-configure.component.html',
  styleUrls: ['./upload-configure.component.scss']
})
export class UploadConfigureComponent {
  constructor(private _uploadConfigureService: UploadConfigureService) {}

  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  goToNexStep() {
    this.stepper.next();
  }

  deleteUploadConfigure() {
    this._uploadConfigureService.deleteUploadConfigure();
  }

  uploadAgain() {
    this._uploadConfigureService.clearDataBefore();
    this.stepper.reset();
  }
}
