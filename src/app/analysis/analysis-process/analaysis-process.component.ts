import { Component, Input } from '@angular/core';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';

import {
  chosenReferenceGenome,
  chosenSampleset,
  chosenSample,
  chosenFiles,
  chosenCnvType,
  chosenChr
} from '../mock-data';

@Component({
  selector: 'app-analysis-process',
  templateUrl: './analysis-process.component.html',
  styleUrls: ['./analysis-process.component.scss']
})
export class AnalysisProcessComponent {
  @Input() chosenReferenceGenome: string;
  @Input() chosenSampleset: Sampleset;
  @Input() chosenSample: string;
  @Input() chosenFiles: UploadCnvToolResult[];
  @Input() chosenCnvType: string;
  @Input() chosenChr: string;

  constructor() {
    // mock data
    this.chosenReferenceGenome = chosenReferenceGenome;
    this.chosenSampleset = chosenSampleset;
    this.chosenSample = chosenSample;
    this.chosenFiles = chosenFiles;
    this.chosenCnvType = chosenCnvType;
    this.chosenChr = chosenChr;
  }
}
