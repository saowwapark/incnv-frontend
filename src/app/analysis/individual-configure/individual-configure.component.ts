import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';
import { IndividualSampleConfig } from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-individual-configure',
  templateUrl: './individual-configure.component.html',
  styleUrls: ['./individual-configure.component.scss']
})
export class IndividualConfigureComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSample: string;
  chosenFiles: UploadCnvToolResult[];
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(private service: AnalysisProcessService) {
    this._unsubscribeAll = new Subject();

    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
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
  setSample(sample: string) {
    if (sample) {
      this.chosenSample = sample;
    }
  }
  setSelectedFiles(files: UploadCnvToolResult[]) {
    if (files && files.length > 0) {
      this.chosenFiles = files;
    }
  }

  confirmConfig() {
    const individualConfig = new IndividualSampleConfig(
      this.chosenReferenceGenome,
      this.chosenChr,
      this.chosenCnvType,
      this.chosenFiles,
      this.chosenSampleset.samplesetName,
      this.chosenSample
    );
    this.service.onIndividualSampleConfigChanged.next(individualConfig);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
