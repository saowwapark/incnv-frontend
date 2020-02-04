import { MERGED_RESULT_NAME, FINAL_RESULT_NAME } from './../analysis.model';
import {
  CnvInfo,
  RegionBp,
  CnvGroup,
  IndividualSampleConfig,
  MultipleSampleConfig
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
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-multiple-process',
  templateUrl: './multiple-process.component.html',
  styleUrls: ['./multiple-process.component.scss']
})
export class MultipleProcessComponent
  implements OnInit, AfterViewInit, OnDestroy {
  multipleConfig: MultipleSampleConfig;
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
    this.service.onMultipleSampleConfigChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: MultipleSampleConfig) => {
        this.multipleConfig = config;
        this.service
          .getMultipleSampleData(this.multipleConfig)
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
