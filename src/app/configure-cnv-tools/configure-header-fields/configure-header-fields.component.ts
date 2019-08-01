import {
  HEADER_CODEX2,
  HEADER_CoNIFER
} from 'src/app/types/mock/ALL_CNV_HEADERS';
import { Component, OnInit } from '@angular/core';
import { HeaderField } from 'src/app/types/header-field';

@Component({
  selector: 'app-configure-header-fields',
  templateUrl: './configure-header-fields.component.html',
  styleUrls: ['./configure-header-fields.component.scss']
})
export class ConfigureHeaderFieldsComponent implements OnInit {
  oldDataSource: HeaderField[] = [HEADER_CODEX2, HEADER_CoNIFER];
  newDataSource: HeaderField[];
  constructor() {}
  ngOnInit() {
    this.newDataSource = [this.createEmptyHeaderField()];
  }
  createEmptyHeaderField() {
    return {
      id: null,
      ownerId: null,
      cnvToolName: null,
      sampleName: null,
      chr: null,
      startBp: null,
      stopBp: null,
      cnvType: null
    };
  }
}
