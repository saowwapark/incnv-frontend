import { UploadCnvToolResult } from './../../shared/models/upload-cnv-tool-result.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';

@Component({
  selector: 'app-analysis-configure',
  templateUrl: './analysis-configure.component.html',
  styleUrls: ['./analysis-configure.component.scss']
})
export class AnalysisConfigureComponent implements OnInit {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;
  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSample: string;
  chosenFiles: UploadCnvToolResult[];
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  constructor() {
    this.chosenSampleset = new Sampleset();
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

  setSamplesetAndNextStep(sampleset: Sampleset) {
    this.chosenSampleset = sampleset;
    this.goToNexStep();
  }
  goToPreviousStep() {
    this.stepper.previous();
  }
  setSampleAndNextStep(sample: string) {
    this.chosenSample = sample;
    this.goToNexStep();
  }
  setUploadFilesAndNextStep(files: UploadCnvToolResult[]) {
    this.chosenFiles = files;
    this.goToNexStep();
  }
}
