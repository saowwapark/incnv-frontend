import { Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { ALL_HEADER_CODEX2, ALL_HEADER_CoNIFER } from 'src/app/types/mock/ALL_CNV_HEADERS';
import { CNVtoolMapHeader } from 'src/app/types/header-field';


export class ConfigureHeaderFiledsService {
  headerFormSubject = new Subject<FormGroup>();
  private _headerFileds;
  constructor() {
    this.headerFormSubject.subscribe(
      (headerForm: FormGroup) => {
        this._headerFileds =  headerForm;
      }
    );
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




