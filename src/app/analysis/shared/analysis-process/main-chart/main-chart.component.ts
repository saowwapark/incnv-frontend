import { chrGrch37 } from './../../../analysis-result/human_chr';
import { takeUntil, tap } from 'rxjs/operators';
import { DgvChart } from './dgv-chart';
import { DgvVariant } from './../../../analysis.model';
import { AnalysisProcessService } from '../analysis-process.service';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  Input,
  HostListener,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked,
  OnDestroy,
  DoCheck,
  ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';

import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MergedChart } from './result-chart';
import { ComparedChart } from './compared-chart';
import {
  CnvGroup,
  RegionBp,
  CnvInfo,
  FINAL_RESULT_NAME
} from 'src/app/analysis/analysis.model';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { Subject, concat } from 'rxjs';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainChartComponent
  implements
    OnInit,
    OnChanges,
    AfterViewInit,
    AfterViewChecked,
    OnDestroy,
    DoCheck {
  @Input() chromosome: string; // static
  @Input() dgvVaraints: DgvVariant[]; // static
  @Input() comparedData: CnvGroup[]; // static
  @Input() mergedData: CnvGroup; // static
  @Input() selectedChrRegion: RegionBp; // always changed
  @Input() containerMargin: {
    // static
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  readonly dgvChartColor = '#304ffe';
  readonly compareChartColor = [
    '#F82DFF'
    // '#ff7f02',
    // '#368c7f',
    // '#ba7636',
    // '#EFA8E4',
    // '#97E5EF',
    // '#c6ff00',
    // '#D4A6D1',
    // '#F1D8BB⁣',
    // '#E98CA4',
    // '#4DA2D7'
  ];
  readonly mergedChartColor = '#673ab7';
  readonly finalChartColor = '#d32f2f';

  selectedCnvs: CnvInfo[] = []; // always changed
  private _unsubscribeAll: Subject<any>;

  @ViewChild('dgvChartDiv', { static: true }) private dgvChartDiv: ElementRef;

  @ViewChild('comparedChartDiv', { static: true })
  private comparedChartDiv: ElementRef;

  @ViewChild('mergedChartDiv', { static: true })
  private mergedChartDiv: ElementRef;

  @ViewChild('finalResultChartDiv', { static: true })
  private finalResultChartDiv: ElementRef;

  dgvChart;
  comparedChart;
  mergedChart;
  finalResultChart;

  finalResultData: CnvGroup;
  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;

    this.createDgvChart();

    this.createComparedChart();

    this.createMergedChart();

    this.createFinalResultChart();
  }

  /**
   *  Constructor
   */
  constructor(
    private _matDialog: MatDialog,
    private detectorRef: ChangeDetectorRef,
    private service: AnalysisProcessService
  ) {
    this.finalResultData = new CnvGroup();
    this.finalResultData.cnvGroupName = FINAL_RESULT_NAME;
    this.finalResultData.cnvInfos = [];

    this._unsubscribeAll = new Subject();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.comparedData || !this.mergedData) {
      return;
    }

    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedChrRegion':
            this.createDgvChart();
            this.createComparedChart();
            this.createMergedChart();
            this.createFinalResultChart();

            break;
        }
      }
    }
  }
  ngDoCheck(): void {}
  ngOnInit() {
    const updateFinalResultData$ = this.service.onSelectedCnvChanged.pipe(
      tap((cnvInfos: CnvInfo[]) => {
        this.selectedCnvs = cnvInfos;
        if (this.selectedCnvs && this.selectedCnvs.length > 0) {
          this.finalResultData.cnvInfos = this.selectedCnvs;
        }
      })
    );
    const generateSelectedRegion$ = this.service.onSelectedCnv.pipe(
      tap((cnvInfo: CnvInfo) => {
        const startBp = cnvInfo.startBp;
        const endBp = cnvInfo.endBp;
        const size = 100000;
        this.selectedChrRegion = this.generateDefaultRegion(
          startBp,
          endBp,
          size
        );
      })
    );

    updateFinalResultData$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.createFinalResultChart();
        this.detectorRef.markForCheck();
      });
    generateSelectedRegion$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        this.createDgvChart();
        this.createComparedChart();
        this.createMergedChart();
        this.createFinalResultChart();
        this.detectorRef.markForCheck();
      });
  }

  ngAfterViewInit() {}

  ngAfterViewChecked() {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  generateDefaultRegion(
    startBp: number,
    endBp: number,
    size: number
  ): RegionBp {
    let regionStartBp: number, regionEndBp: number;
    if (startBp - size) {
      regionStartBp = startBp - size;
    } else {
      regionStartBp = 0;
    }
    if (endBp + size <= chrGrch37[this.chromosome].length) {
      regionEndBp = endBp + size;
    } else {
      regionEndBp = chrGrch37[this.chromosome].length;
    }
    return new RegionBp(startBp, endBp);
  }

  createDgvChart() {
    if (!this.selectedChrRegion) {
      return;
    }
    if (this.dgvChart) {
      this.dgvChart.removeVis();
    }
    this.dgvChart = new DgvChart(
      '1',
      this.dgvChartDiv.nativeElement,
      this.dgvVaraints,
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      ['DGV'],
      this.dgvChartColor
    );
  }
  createComparedChart() {
    if (!this.selectedChrRegion) {
      return;
    }
    if (this.comparedChart) {
      this.comparedChart.removeVis();
    }
    this.comparedChart = new ComparedChart(
      '2',
      this.comparedChartDiv.nativeElement,
      this.comparedData,
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      this.comparedData.map(tool => tool.cnvGroupName),
      4, // fix data because backend don't find overlap region for performance and rarely to have overlap more than four in one tool
      this.compareChartColor
    );

    this.comparedChart.onClickSubbars((cnvGroupName, data) => {
      const selectedCnvRegions: RegionBp[] = [];
      for (const selectedCnv of this.finalResultData.cnvInfos) {
        const selectedCnvRegion = new RegionBp(
          selectedCnv.startBp,
          selectedCnv.endBp
        );
        selectedCnvRegions.push(selectedCnvRegion);
      }

      this.createDialog(cnvGroupName, data);
    });
  }

  findMaxOverlapNumber(cnvInfos) {
    let max = 0;
    for (const cnvInfo of cnvInfos) {
      if (max < cnvInfo.overlaps.length) {
        max = cnvInfo.overlaps.length;
      }
    }
    return max;
  }

  createMergedChart() {
    if (!this.selectedChrRegion) {
      return;
    }
    if (this.mergedChart) {
      this.mergedChart.removeVis();
    }
    const maxOverlap = this.findMaxOverlapNumber(this.mergedData.cnvInfos);

    this.mergedChart = new MergedChart(
      '3',
      this.mergedChartDiv.nativeElement,
      [this.mergedData],
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      [this.mergedData.cnvGroupName],
      maxOverlap,
      this.mergedChartColor
    );

    this.mergedChart.onClickSubbars((cnvGroupName, data) => {
      const selectedCnvRegions: RegionBp[] = [];
      for (const selectedCnv of this.finalResultData.cnvInfos) {
        const selectedCnvRegion = new RegionBp(
          selectedCnv.startBp,
          selectedCnv.endBp
        );
        selectedCnvRegions.push(selectedCnvRegion);
      }

      this.createDialog(cnvGroupName, data);
    });
  }

  createFinalResultChart() {
    if (!this.selectedChrRegion) {
      return;
    }
    if (this.finalResultChart) {
      this.finalResultChart.removeVis();
    }
    const maxOverlap = this.findMaxOverlapNumber(this.mergedData.cnvInfos);
    this.finalResultChart = new MergedChart(
      '4',
      this.finalResultChartDiv.nativeElement,
      [this.finalResultData],
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      [FINAL_RESULT_NAME],
      maxOverlap,
      this.finalChartColor
    );

    this.finalResultChart.onClickSubbars((cnvGroupName, data) => {
      this.createDialog(cnvGroupName, data);
    });
  }

  private createDialog(cnvGroupName: string, cnvInfo: CnvInfo) {
    this.dialogRef = this._matDialog.open(AnnotationDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        title: cnvGroupName,
        cnvInfo: cnvInfo
      }
    });

    // add data
    this.dialogRef.afterClosed().subscribe((response: CnvInfo) => {
      if (!response) {
        return;
      }
      const findedIndex = this.findIndex(response, this.selectedCnvs);
      if (findedIndex >= 0) {
        // remove this cnv from finalResultData
        this.finalResultData.cnvInfos.splice(findedIndex, 1);
      } else {
        // add this cnv into finalResultData
        this.finalResultData.cnvInfos.push(response);
      }
      this.createFinalResultChart();
      this.service.onSelectedCnvChanged.next(this.finalResultData.cnvInfos);
    });
  }

  findIndex(obj: any, list: any[]) {
    let index = -1;

    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        index = i;
        break;
      }
    }
    return index;
  }
}
