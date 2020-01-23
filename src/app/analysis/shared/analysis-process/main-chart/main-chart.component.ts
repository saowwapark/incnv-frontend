import { AnalysisProcessService } from '../analysis-process.service';
import { FinalResultChart } from './final-result-chart';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  Input,
  HostListener,
  Output,
  EventEmitter,
  SimpleChanges,
  AfterViewInit,
  AfterViewChecked
} from '@angular/core';

import { MatDialogRef, MatDialog } from '@angular/material';
import { MergedChart } from './merged-chart';
import { ComparedChart } from './compared-chart';
import {
  CnvTool,
  RegionBp,
  CnvInfo,
  FINAL_RESULT_ID
} from 'src/app/analysis/analysis.model';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss', './merged-chart.css']
})
export class MainChartComponent
  implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {
  @Input() comparedData: CnvTool[];
  @Input() mergedData: CnvTool;
  @Input() height: number;
  @Input() selectedChrRegion: RegionBp;
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Input() inputCnvs: CnvInfo[];

  @Output() selectCnvs = new EventEmitter<CnvInfo[]>();

  private comparedChartDiv: ElementRef;
  @ViewChild('comparedChartDiv', { static: false })
  set comparedChartContent(comparedChartContent: ElementRef) {
    this.comparedChartDiv = comparedChartContent;
    if (this.comparedChartDiv) {
      this.createComparedChart();
    }
  }

  private mergedChartDiv: ElementRef;
  @ViewChild('mergedChartDiv', { static: false })
  set mergedChartContent(mergedChartContent: ElementRef) {
    this.mergedChartDiv = mergedChartContent;
    if (this.mergedChartDiv) {
      this.createMergedChart();
    }
  }

  private finalResultChartDiv: ElementRef;
  @ViewChild('finalResultChartDiv', { static: false }) set content(
    content: ElementRef
  ) {
    this.finalResultChartDiv = content;
    if (this.finalResultChartDiv) {
      this.createFinalResultChart();
    }
  }

  comparedChart;
  mergedChart;
  finalResultChart;

  finalResultData: CnvTool;

  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;

    this.createComparedChart();

    this.createMergedChart();

    this.createFinalResultChart();
  }

  constructor(
    private _matDialog: MatDialog,
    private service: AnalysisProcessService
  ) {
    this.finalResultData = new CnvTool();
    this.finalResultData.cnvToolId = FINAL_RESULT_ID;
    this.finalResultData.cnvInfos = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.comparedData || !this.mergedData) {
      return;
    }

    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedChrRegion':
            if (this.selectedChrRegion) {
              this.createComparedChart();
              this.createMergedChart();
              this.createFinalResultChart();
            }

            break;
          case 'inputCnvs':
            if (this.inputCnvs && this.inputCnvs.length > 0) {
              this.finalResultData.cnvInfos = this.inputCnvs;
              this.createFinalResultChart();

              break;
            }
        }
      }
    }
  }
  ngOnInit() {}

  ngAfterViewInit() {}

  ngAfterViewChecked() {}

  createComparedChart() {
    if (!this.comparedChartDiv) {
      return;
    }
    if (this.comparedChart) {
      this.comparedChart.removeVis();
    }
    this.comparedChart = new ComparedChart(
      '1',
      this.comparedChartDiv.nativeElement,
      this.comparedData,
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      this.comparedData.map(tool => tool.cnvToolId)
    );

    this.comparedChart.onClickSubbars((cnvToolId, data) => {
      const selectedCnvRegions: RegionBp[] = [];
      for (const selectedCnv of this.finalResultData.cnvInfos) {
        const selectedCnvRegion = new RegionBp(
          selectedCnv.startBp,
          selectedCnv.endBp
        );
        selectedCnvRegions.push(selectedCnvRegion);
      }

      this.createDialog(cnvToolId, data, selectedCnvRegions);
    });
  }

  createMergedChart() {
    if (!this.mergedChartDiv) {
      return;
    }
    if (this.mergedChart) {
      this.mergedChart.removeVis();
    }
    this.mergedChart = new MergedChart(
      '2',
      this.mergedChartDiv.nativeElement,
      [this.mergedData],
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      [this.mergedData.cnvToolId],
      this.comparedData.length,
      'red'
    );

    this.mergedChart.onClickSubbars((cnvToolId, data) => {
      const selectedCnvRegions: RegionBp[] = [];
      for (const selectedCnv of this.finalResultData.cnvInfos) {
        const selectedCnvRegion = new RegionBp(
          selectedCnv.startBp,
          selectedCnv.endBp
        );
        selectedCnvRegions.push(selectedCnvRegion);
      }

      this.createDialog(cnvToolId, data, selectedCnvRegions);
    });
  }

  createFinalResultChart() {
    if (!this.finalResultChartDiv) {
      return;
    }
    if (this.finalResultChart) {
      this.finalResultChart.removeVis();
    }
    this.finalResultChart = new FinalResultChart(
      '2',
      this.finalResultChartDiv.nativeElement,
      [this.finalResultData],
      this.containerMargin,
      [this.selectedChrRegion.startBp, this.selectedChrRegion.endBp],
      [FINAL_RESULT_ID],
      this.comparedData.length,
      'green'
    );

    this.finalResultChart.onClickSubbars((cnvToolId, data) => {
      this.createDialog(cnvToolId, data);
    });
  }

  private createDialog(
    cnvToolId: string,
    cnvInfo: CnvInfo,
    selectedCnvRegions?: RegionBp[]
  ) {
    this.dialogRef = this._matDialog.open(AnnotationDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        title: cnvToolId,
        cnvInfo: cnvInfo,
        selectedCnvRegions: selectedCnvRegions
      }
    });

    // add data
    this.dialogRef.afterClosed().subscribe((response: CnvInfo) => {
      if (!response) {
        return;
      }
      this.service
        .updateCnvInfo(response)
        .subscribe((updatedCnvInfo: CnvInfo) => {
          this.finalResultData.cnvInfos.push(updatedCnvInfo);
          this.createFinalResultChart();
          // if (this.finalResultChart) {
          //   this.finalResultChart.updateVis([this.finalResultData]);
          // }
          this.selectCnvs.next(this.finalResultData.cnvInfos);
        });
    });
  }
}
