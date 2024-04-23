import { Subject, throwError, Observable, combineLatest } from 'rxjs';
import {
  DgvVariant,
  CHRACTER_WIDTH,
  INDIVIDUAL_SAMPLE_ANALYSIS,
  CnvInfoView,
  RegionBp,
  CnvGroup,
  IndividualSampleConfig,
  MERGED_RESULT_NAME,
  SELECTED_RESULT_NAME
} from '../analysis.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';
import {
  takeUntil,
  catchError,
  mergeMap,
  shareReplay,
  map,
} from 'rxjs/operators';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/shared/loading/loading.service';
import { MessagesService } from 'src/app/shared/components/messages/messages.service';
import { Margin } from '../visualization.model';
import { INDIVIDUAL_CONFIG } from 'src/constants/local-storage.const';

interface IndividaulData {
  individualConfig: IndividualSampleConfig;
  dgvVariants: DgvVariant[];
  cnvTools: CnvGroup[];
  mergedTool: CnvGroup;
  containerMargin: Margin;
}

@Component({
  selector: 'app-individual-process',
  templateUrl: './individual-process.component.html',
  styleUrls: ['./individual-process.component.scss'],
  providers: [LoadingService],
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
export class IndividualProcessComponent implements OnInit, OnDestroy {
  data$: Observable<IndividaulData>;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfoView[];
  readonly analysisType = INDIVIDUAL_SAMPLE_ANALYSIS;

  // private
  private _unsubscribeAll: Subject<void>;

  constructor(
    private service: AnalysisProcessService,
    private router: Router,
    private messagesService: MessagesService,
    public loadingService: LoadingService
  ) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    const individualConfig$ = this.service.onIndividualSampleConfigChanged
      .asObservable()
      .pipe(
        map(() => {
          const individualConfigString = localStorage.getItem(INDIVIDUAL_CONFIG);
          if(individualConfigString) {
            return JSON.parse(individualConfigString);
          }
        }
      ));

    const dgvVariants$ = individualConfig$.pipe(
      mergeMap((config: IndividualSampleConfig) =>
        this.service.getDgvVariants(config.referenceGenome, config.chromosome).pipe(
          catchError((err: unknown) => {
            const message = 'Could not load DGV variants';
            this.messagesService.showErrors(message);
            console.log(message, err);
            this.router.navigate(['/individual-sample']);
            return throwError(err);
          })
        )
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
    const individualSampleData$ = individualConfig$.pipe(
      mergeMap((config: IndividualSampleConfig) =>
        this.service.getIndividualSampleData(config).pipe(
          catchError((err: unknown) => {
            const message = 'Could not load individual sample data';
            this.messagesService.showErrors(message);
            console.log(message, err);
            this.router.navigate(['/individual-sample']);
            return throwError(err);
          })
        )
      ),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    const cnvTools$ = individualSampleData$.pipe(
      map(individaulSampleData => individaulSampleData.annotatedCnvTools),
      catchError((err: unknown) => {
        const message = 'Could not load CNV tools';
        this.messagesService.showErrors(message);
        console.log(message);
        return throwError(err);
      })
    );
    const mergedTool$ = individualSampleData$.pipe(
      map(individaulSampleData => individaulSampleData.annotatedMergedTool),
      catchError((err: unknown) => {
        const message = 'Could not load merged CNV tools';
        this.messagesService.showErrors(message);
        console.log(message);
        return throwError(err);
      })
    );

    const containerMargin$ = cnvTools$.pipe(
      map(cnvTools => this.calContainerMargin(cnvTools))
    );

    this.data$ = combineLatest([
      individualConfig$,
      dgvVariants$,
      cnvTools$,
      mergedTool$,
      containerMargin$
    ]).pipe(
      map(
        ([
          individualConfig,
          dgvVariants,
          cnvTools,
          mergedTool,
          containerMargin
        ]) => ({
          individualConfig,
          dgvVariants,
          cnvTools,
          mergedTool,
          containerMargin
        })
      ),
      catchError((err: unknown) => {
        console.log(err);
        this.router.navigate(['/individual-sample']);
        return throwError(err);
      })
    );

    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(cnvInfos => {
        this.selectedCnvs = cnvInfos;
      });
  }
  selectChrRegion(selectedChrRegion: RegionBp) {
    this.selectedChrRegion = selectedChrRegion;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  private calContainerMargin(cnvTools: CnvGroup[]): Margin {
    if (!cnvTools) {
      return undefined;
    }
    // max character length
    let maxLength = 0;
    for (const tool of cnvTools) {
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
}
