import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../sampleset/sampleset.model';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;
  referenceGenome: string;
  sampleset: Sampleset;
  sample: string;
  constructor() {
    this.sampleset = new Sampleset();
  }

  ngOnInit() {}

  goToNexStep() {
    this.stepper.next();
  }

  goToChooseSample(sampleset: Sampleset) {
    this.sampleset = sampleset;
    this.goToNexStep();
  }
  goToPreviousStep() {
    this.stepper.previous();
  }
  goToChooseFile(sample: string) {
    this.sample = sample;
    console.log(sample);
    this.goToNexStep();
  }
}
