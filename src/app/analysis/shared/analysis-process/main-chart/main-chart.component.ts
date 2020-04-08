import createNumberMask from '../../../../../../node_modules/text-mask-addons/dist/createNumberMask';
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
  SELECTED_RESULT_NAME,
  MERGED_RESULT_NAME
} from 'src/app/analysis/analysis.model';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { Subject, concat } from 'rxjs';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

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
  readonly dgvChartColor = '#00A2FD';
  readonly compareChartColor = ['#FDA404']; // ['#ff7f02'];
  readonly mergedChartColor = '#d32f2f';
  readonly finalChartColor = '#613EB4';

  // selectedCnvs: CnvInfo[] = []; // always changed
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

  numberMark;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;

    this.createAllCharts();
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
    this.finalResultData.cnvGroupName = SELECTED_RESULT_NAME;
    this.finalResultData.cnvInfos = [];

    this._unsubscribeAll = new Subject();
    this.numberMark = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: false,
      allowNegative: false
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.comparedData || !this.mergedData) {
      return;
    }

    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedChrRegion':
            this.createAllCharts();

            break;
        }
      }
    }
  }
  ngDoCheck(): void {}
  ngOnInit() {
    const updateFinalResultData$ = this.service.onSelectedCnvChanged.pipe(
      tap((selectedCnvs: CnvInfo[]) => {
        // clear all CNV select status to false
        this.updateAllSelectStatus(this.mergedData.cnvInfos, false);
        // update status of merged CNVs and selected CNVs to be true
        for (const selectedCnv of selectedCnvs) {
          selectedCnv.isSelected = true;
          for (const mergedCnv of this.mergedData.cnvInfos) {
            if (
              mergedCnv.startBp === selectedCnv.startBp &&
              mergedCnv.endBp === selectedCnv.endBp
            ) {
              mergedCnv.isSelected = true;
              break;
            }
          }
        }

        this.finalResultData.cnvInfos = selectedCnvs;
      })
    );
    const generateSelectedRegion$ = this.service.onSelectedCnv.pipe(
      tap((cnvInfo: CnvInfo) => {
        const startBp = cnvInfo.startBp;
        const endBp = cnvInfo.endBp;
        const size = 200000;
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

  findMaxOverlapNumber(cnvInfos) {
    let max = 0;
    for (const cnvInfo of cnvInfos) {
      if (max < cnvInfo.overlaps.length) {
        max = cnvInfo.overlaps.length;
      }
    }
    return max;
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
      1, // 4 fix data because backend don't find overlap region for performance and rarely to have overlap more than four in one tool
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
      [MERGED_RESULT_NAME],
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

      this.createDialog(MERGED_RESULT_NAME, data);
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
      [SELECTED_RESULT_NAME],
      maxOverlap,
      this.finalChartColor
    );

    this.finalResultChart.onClickSubbars((cnvGroupName, data) => {
      this.createDialog(SELECTED_RESULT_NAME, data);
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
      const findedIndex = this.findIndex(
        response,
        this.finalResultData.cnvInfos
      );
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

  updateSelectedBp(startBp: string, endBp: string) {
    const startBpNumber = Number(startBp.replace(/\D/g, ''));
    const endBpNumber = Number(endBp.replace(/\D/g, ''));

    if (endBpNumber < startBpNumber) {
      // error
      const errorMessage =
        'End base pair has to be greater than start base pair.';
      this.openErrorDialog(errorMessage);
    } else {
      this.selectedChrRegion.startBp = startBpNumber;
      this.selectedChrRegion.endBp = endBpNumber;
      this.createAllCharts();
    }
  }
  openErrorDialog(errorMessage: string) {
    this._matDialog.open(ErrorDialogComponent, {
      panelClass: 'dialog-warning',
      disableClose: false,
      data: {
        errorMessage: errorMessage
      }
    });
  }

  createAllCharts() {
    this.createDgvChart();
    this.createComparedChart();
    this.createMergedChart();
    this.createFinalResultChart();
  }

  updateAllSelectStatus(list: CnvInfo[], isSelected: boolean) {
    for (let i = 0; i < list.length; i++) {
      list[i].isSelected = isSelected;
    }
  }
}
