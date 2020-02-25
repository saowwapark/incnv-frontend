import {
  MERGED_RESULT_NAME,
  FINAL_RESULT_NAME,
  DgvVariant
} from './../analysis.model';
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

import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { BehaviorSubject, Subject, forkJoin, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-multiple-process',
  templateUrl: './multiple-process.component.html',
  styleUrls: ['./multiple-process.component.scss']
})
export class MultipleProcessComponent
  implements OnInit, AfterViewInit, OnDestroy {
  dgvVariants: DgvVariant[];
  multipleConfig: MultipleSampleConfig;
  cnvSamples: CnvGroup[];
  mergedTool: CnvGroup;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfo[];
  containerMargin: { top: number; right: number; bottom: number; left: number };
  isLoading: BehaviorSubject<boolean>;

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(private service: AnalysisProcessService, private router: Router) {
    this.isLoading = new BehaviorSubject(true);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.service.onMultipleSampleConfigChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: MultipleSampleConfig) => {
        this.multipleConfig = config;
        const observables$ = [
          this.service.getDgvVariants(
            this.multipleConfig.referenceGenome,
            this.multipleConfig.chromosome
          ),
          this.service.getMultipleSampleData(this.multipleConfig)
        ];

        if (!this.multipleConfig.referenceGenome) {
          this.router.navigate(['/multiple-sample']);
        } else {
          forkJoin(observables$)
            .pipe(
              catchError(err => {
                this.router.navigate(['/multiple-sample']);
                return throwError(err);
              }),
              takeUntil(this._unsubscribeAll)
            )
            .subscribe(
              ([dgvs, individualSample]: [
                DgvVariant[],
                [CnvGroup[], CnvGroup]
              ]) => {
                this.dgvVariants = dgvs;
                this.cnvSamples = individualSample[0];
                this.mergedTool = individualSample[1];
                this.containerMargin = this.calContainerMargin();
                this.isLoading.next(false);
              }
            );
        }
      });

    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cnvInfos => {
        this.selectedCnvs = cnvInfos;
      });
  }

  selectChrRegion(selectedChrRegion: RegionBp) {
    this.selectedChrRegion = selectedChrRegion;
  }

  private calContainerMargin() {
    // max character lenght
    let maxLength = 0;
    for (const tool of this.cnvSamples) {
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
