import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import {
  CNVtoolMapHeader,
  ALL_HEADER_CODEX2,
  ALL_HEADER_CoNIFER
} from 'src/app/cnvtools/tab-file-mapping/tab-file-mapping.model';

export class ConfigureHeaderFiledsService {
  headerFormSubject = new Subject<FormGroup>();
  private _headerFileds;
  constructor() {
    this.headerFormSubject.subscribe((headerForm: FormGroup) => {
      this._headerFileds = headerForm;
    });
  }
  getHeaderFromFiles(): CNVtoolMapHeader[] {
    const result = [
      {
        cnvToolName: 'CODEX2',
        headers: ALL_HEADER_CODEX2
      },
      {
        cnvToolName: 'CoNIFER',
        headers: ALL_HEADER_CoNIFER
      }
    ];
    return result;
  }

  getHeaderFromForm() {
    //
  }
}
