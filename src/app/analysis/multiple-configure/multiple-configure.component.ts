import { takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { MultipleConfigureService } from 'src/app/analysis/multiple-configure/multiple-configure.service';
import { findDuplicates } from './../../utils/logic.utils';
import { UploadCnvToolResult } from '../../shared/models/upload-cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Sampleset } from '../../sampleset/sampleset.model';
import {
  IndividualSampleConfig,
  MultipleSampleConfig
} from '../analysis.model';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-multiple-configure',
  templateUrl: './multiple-configure.component.html',
  styleUrls: ['./multiple-configure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleConfigureComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', { static: true }) private stepper: MatStepper;

  chosenReferenceGenome: string;
  chosenSampleset: Sampleset;
  chosenSamples: string[];
  chosenFile: UploadCnvToolResult;
  chosenCnvType: string;
  chosenChr: string;
  chrs: string[];

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private dialog: MatDialog,
    private processService: AnalysisProcessService,
    private configureService: MultipleConfigureService
  ) {
    this._unsubscribeAll = new Subject();

    this.chosenReferenceGenome = 'grch38';
    this.chosenSampleset = new Sampleset();
    this.chosenSampleset.samples = [];
    this.chosenSamples = [];
    this.chosenFile = new UploadCnvToolResult();
    this.chosenCnvType = 'duplication';
    this.chosenChr = '';
    this.chrs = [];
  }

  ngOnInit() {
    this.createAllChrs();

    this.configureService.onSelectedSamplesChanged
      .pipe(distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamples => {
        this.chosenSamples = selectedSamples;
        this.chosenFile = new UploadCnvToolResult();
      });
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

      // clear independent values -> chosenSamples and chosenFile
      this.chosenSamples = [];
      this.configureService.onSelectedSamplesChanged.next([]);
      this.chosenFile = new UploadCnvToolResult();
    } else {
      this.chosenSampleset = sampleset;
    }
  }

  // setSamples(samples: string[]) {
  //   if (
  //     samples &&
  //     JSON.stringify(samples) !== JSON.stringify(this.chosenSamples)
  //   ) {
  //     this.chosenSamples = samples;

  //     // clear independent values -> chosenFiles
  //     this.chosenFile = new UploadCnvToolResult();
  //   } else {
  //     this.chosenSamples = samples;
  //   }
  // }

  setFile(file: UploadCnvToolResult) {
    this.chosenFile = file;
  }

  confirmConfig() {
    const multipleConfig = new MultipleSampleConfig(
      this.chosenReferenceGenome,
      this.chosenChr,
      this.chosenCnvType,
      this.chosenFile,
      this.chosenSampleset.samplesetName,
      this.chosenSamples
    );
    this.processService.onMultipleSampleConfigChanged.next(multipleConfig);
  }

  validateChosenSampleset() {
    if (!this.chosenSampleset.samplesetId) {
      const errorMessage = 'Please select one sample set.';
      this.openErrorDialog(errorMessage);
    } else {
      this.stepper.next();
    }
  }

  validateChosenSamples() {
    // // remove not selection (in case accepting not selection)
    // const realSamples = this.chosenSamples.filter(
    //   (sample, index) => sample !== ''
    // );
    // // update this.chosenSamples
    // this.chosenSamples = realSamples;

    // check length
    if (this.chosenSamples.length < 2) {
      const errorMessage = 'Please select at least two samples.';
      this.openErrorDialog(errorMessage);
      return null;
    }

    // check duplication
    const allDuplicatedSamples = findDuplicates(this.chosenSamples);
    if (allDuplicatedSamples.length > 0) {
      const errorMessage = `Duplicated at ${allDuplicatedSamples.join(', ')}`;
      this.openErrorDialog(errorMessage);
      return null;
    }

    this.stepper.next();
  }
  validateChosenFile() {
    if (!this.chosenFile.uploadCnvToolResultId) {
      const errorMessage = 'Please select one file.';
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
