import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';
import {
  IndividualSampleConfig,
  MultipleSampleConfig
} from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';

@Component({
  selector: 'app-multiple-configure',
  templateUrl: './multiple-configure.component.html',
  styleUrls: ['./multiple-configure.component.scss']
})
export class MultipleConfigureComponent implements OnInit {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSamples: string[];
  chosenFile: UploadCnvToolResult;
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  constructor(private service: AnalysisProcessService) {
    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
    this.chosenSamples = [];
    this.chosenChr = '';
    this.chrs = [];
  }

  ngOnInit() {
    this.createAllChrs();
  }

  createAllChrs() {
    for (let i = 1; i < 23; i++) {
      this.chrs.push(String(i));
    }
    this.chrs.push('x');
    this.chrs.push('y');
  }
  goToNexStep() {
    this.stepper.next();
  }

  setSampleset(sampleset: Sampleset) {
    if (sampleset) {
      this.chosenSampleset = sampleset;
    }
  }
  goToPreviousStep() {
    this.stepper.previous();
  }
  setSamples(samples: string[]) {
    if (samples && samples.length > 0) {
      this.chosenSamples = samples;
    }
  }
  setSelectedFile(file: UploadCnvToolResult) {
    if (file) {
      this.chosenFile = file;
    }
  }

  confirmConfig() {
    const individualConfig = new MultipleSampleConfig(
      this.chosenReferenceGenome,
      this.chosenChr,
      this.chosenCnvType,
      this.chosenFile,
      this.chosenSamples
    );
    this.service.onMultipleConfigChanged.next(individualConfig);
  }
}
