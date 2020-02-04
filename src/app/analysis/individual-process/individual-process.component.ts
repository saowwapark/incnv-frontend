import { Observable, Subject, BehaviorSubject } from 'rxjs';
import {
  CnvInfo,
  RegionBp,
  CnvGroup,
  IndividualSampleConfig,
  MERGED_RESULT_NAME,
  FINAL_RESULT_NAME
} from '../analysis.model';
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {
  chosenReferenceGenome,
  chosenSampleset,
  chosenSample,
  chosenFiles,
  chosenCnvType,
  chosenChr
} from '../mock-data';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-individual-process',
  templateUrl: './individual-process.component.html',
  styleUrls: ['./individual-process.component.scss']
})
export class IndividualProcessComponent
  implements OnInit, AfterViewInit, OnDestroy {
  individualConfig: IndividualSampleConfig;
  cnvTools: CnvGroup[];
  mergedTool: CnvGroup;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfo[];
  containerMargin: { top: number; right: number; bottom: number; left: number };
  isLoading: BehaviorSubject<boolean>;

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(private service: AnalysisProcessService) {
    this.isLoading = new BehaviorSubject(true);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    // // mock data
    //  this.individualConfig.referenceGenome = chosenReferenceGenome;
    //  this.individualConfig.samplesetName =
    //    chosenSampleset.samplesetName;
    //  this.individualConfig.sample = chosenSample;
    //  this.individualConfig.uploadCnvToolResults = chosenFiles;
    //  this.individualConfig.cnvType = chosenCnvType;
    //  this.individualConfig.chromosome = chosenChr;

    this.service.onIndividualSampleConfigChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: IndividualSampleConfig) => {
        this.individualConfig = config;
        this.service
          .getIndividualSampleData(this.individualConfig)
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(data => {
            this.cnvTools = data[0];
            this.mergedTool = data[1];
            this.containerMargin = this.calContainerMargin();
            this.isLoading.next(false);
          });
      });
  }

  selectChrRegion(selectedChrRegion: RegionBp) {
    this.selectedChrRegion = selectedChrRegion;
  }

  selectCnvs(selectedCnvs: CnvInfo[]) {
    this.selectedCnvs = [...selectedCnvs];
  }

  exportCnvInfos() {
    this.service.downloadCnvInfos(this.selectedCnvs).subscribe(() => {
      console.log('export success');
    });
  }
  private calContainerMargin() {
    // max character lenght
    let maxLength = 0;
    for (const tool of this.cnvTools) {
      const length = tool.cnvGroupName.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    maxLength = Math.max(
      maxLength,
      MERGED_RESULT_NAME.length,
      FINAL_RESULT_NAME.length
    );
    // create margins and dimensions
    const containerMargin = {
      top: 40,
      right: 40,
      bottom: 30,
      left: 10 + 6 * maxLength
    };
    return containerMargin;
  }

  ngAfterViewInit(): void {}

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
