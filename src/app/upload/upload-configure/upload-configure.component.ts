import { Component } from '@angular/core';
import { MatStepper } from '@angular/material';

@Component({
  selector: 'upload-configure',
  templateUrl: './upload-configure.component.html',
  styleUrls: ['./upload-configure.component.scss']
})
export class UploadConfigureComponent {
  goForward(stepper: MatStepper) {
    stepper.next();
  }
}
