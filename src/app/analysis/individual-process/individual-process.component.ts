import { DgvVariant, CHRACTER_WIDTH } from './../analysis.model';
import { Subject, BehaviorSubject, forkJoin, throwError } from 'rxjs';

import {
  CnvInfo,
  RegionBp,
  CnvGroup,
  IndividualSampleConfig,
  MERGED_RESULT_NAME,
  SELECTED_RESULT_NAME
} from '../analysis.model';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import { takeUntil, map, catchError } from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-individual-process',
  templateUrl: './individual-process.component.html',
  styleUrls: ['./individual-process.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class IndividualProcessComponent
  implements OnInit, AfterViewInit, OnDestroy {
  dgvVariants: DgvVariant[];
  individualConfig: IndividualSampleConfig;
  cnvTools: CnvGroup[];
  mergedTool: CnvGroup;
  selectedChrRegion: RegionBp;
  containerMargin: { top: number; right: number; bottom: number; left: number };
  isLoading: BehaviorSubject<boolean>;
  selectedCnvs: CnvInfo[];

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(private service: AnalysisProcessService, private router: Router) {
    this.isLoading = new BehaviorSubject(true);
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.service.onIndividualSampleConfigChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config: IndividualSampleConfig) => {
        this.individualConfig = config;
        const observables$ = [
          this.service.getDgvVariants(
            this.individualConfig.referenceGenome,
            this.individualConfig.chromosome
          ),
          this.service.getIndividualSampleData(this.individualConfig)
        ];

        if (!this.individualConfig.referenceGenome) {
          this.router.navigate(['/individual-sample']);
        } else {
          forkJoin(observables$)
            .pipe(
              catchError(err => {
                this.router.navigate(['/individual-sample']);
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
                this.cnvTools = individualSample[0];
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
    for (const tool of this.cnvTools) {
      const length = tool.cnvGroupName.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    maxLength = Math.max(
      maxLength,
      MERGED_RESULT_NAME.length,
      SELECTED_RESULT_NAME.length
    );
    // create margins and dimensions
    const containerMargin = {
      top: 40,
      right: 10,
      bottom: 30,
      left: 10 + CHRACTER_WIDTH * maxLength
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
