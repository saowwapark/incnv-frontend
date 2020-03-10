import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';
import { IndividualSampleConfig } from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-individual-configure',
  templateUrl: './individual-configure.component.html',
  styleUrls: ['./individual-configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private dialog: MatDialog,
    private service: AnalysisProcessService
  ) {
    this._unsubscribeAll = new Subject();

    this.chosenReferenceGenome = 'grch38';
    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
    this.chosenSample = '';
    this.chosenFiles = [];
    this.chosenCnvType = 'duplication';
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
  goToPreviousStep() {
    this.stepper.previous();
  }
  goToNexStep() {
    this.stepper.next();
  }

  setSampleset(sampleset: Sampleset) {
    if (sampleset && sampleset !== this.chosenSampleset) {
      // update chosen sampleset
      this.chosenSampleset = sampleset;

      // clear independent values -> chosenSample
      this.chosenSample = '';
    } else {
      this.chosenSampleset = sampleset;
    }
  }

  setSample(sample: string) {
    if (sample && sample !== this.chosenSample) {
      // update chosen sample
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

  validateChosenSampleset() {
    if (!this.chosenSampleset.samplesetId) {
      const errorMessage = 'Please select one sample set.';
      this.openErrorDialog(errorMessage);
    } else {
      this.stepper.next();
    }
  }
  validateChosenSample() {
    if (this.chosenSample.length === 0) {
      const errorMessage = 'Please select one sample.';
      this.openErrorDialog(errorMessage);
    } else {
      this.stepper.next();
    }
  }
  validateChosenFiles() {
    if (this.chosenFiles.length < 2) {
      const errorMessage = 'Please select at least two files.';
      this.openErrorDialog(errorMessage);
    } else {
      this.stepper.next();
    }
  }
  validateChosenChromosome() {
    if (this.chosenChr.length === 0) {
      const errorMessage = 'Please select one chromosome.';
      this.openErrorDialog(errorMessage);
    } else {
      this.stepper.next();
    }
  }

  openErrorDialog(errorMessage: string) {
    this.dialog.open(ErrorDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false,
      data: {
        errorMessage: errorMessage
      }
    });
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
