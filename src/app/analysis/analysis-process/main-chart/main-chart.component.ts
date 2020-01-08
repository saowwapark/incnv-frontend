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
  EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import {
  CnvToolAnnotation,
  CnvFragmentAnnotation,
  FINAL_RESULT_IDENTITY
} from '../../analysis.model';
import { AnnotationDialogComponent } from './annotation-dialog/annotation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { MergedChart } from './merged-chart';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss']
})
export class MainChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];
  @Input() height: number;
  @Input() regionStartBp: number;
  @Input() regionEndBp: number;
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Output() selectCnvs = new EventEmitter<CnvFragmentAnnotation[]>();

  @ViewChild('mergedChartDiv', { static: true })
  private mergedChartDiv: ElementRef;
  @ViewChild('finalResultChartDiv', { static: true })
  private finalResultChartDiv: ElementRef;

  mergedChart;
  finalResultChart;

  finalResultData: CnvToolAnnotation;

  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  chartWidth: number;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chartWidth = event.target.innerWidth;
    // this.updateChart();
  }

  constructor(private _matDialog: MatDialog) {
    this.finalResultData = new CnvToolAnnotation();
    this.finalResultData.cnvToolIdentity = FINAL_RESULT_IDENTITY;
    this.finalResultData.cnvFragmentAnnotations = [];
  }
  ngOnChanges(): void {
    if (!this.cnvTools) {
      return;
    }
    if (this.mergedChart) {
      this.mergedChart.removeVis();
    }

    if (this.finalResultChart) {
      this.finalResultChart.removeVis();
    }

    this.createMergedChart();
    this.createFinalResultChart();
  }
  ngOnInit() {}

  createMergedChart() {
    this.mergedChart = new MergedChart(
      this.mergedChartDiv.nativeElement,
      this.cnvTools,
      this.containerMargin,
      [this.regionStartBp, this.regionEndBp],
      this.cnvTools.map(tool => tool.cnvToolIdentity)
    );

    this.mergedChart.onClickSubbars((cnvToolIdentity, data) => {
      this.createDialog(cnvToolIdentity, data);
    });
  }

  createFinalResultChart() {
    this.finalResultChart = new FinalResultChart(
      this.finalResultChartDiv.nativeElement,
      [this.finalResultData],
      this.containerMargin,
      [this.regionStartBp, this.regionEndBp],
      [FINAL_RESULT_IDENTITY],
      this.cnvTools.length - 1
    );

    this.mergedChart.onClickSubbars((cnvToolIdentity, data) => {
      this.createDialog(cnvToolIdentity, data);
    });
  }

  private createDialog(
    cnvToolIdentity: string,
    cnvFragmentAnnotation: CnvFragmentAnnotation
  ) {
    this.dialogRef = this._matDialog.open(AnnotationDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        cnvToolIdentity: cnvToolIdentity,
        cnvFragmentAnnotation: cnvFragmentAnnotation
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      this.finalResultData.cnvFragmentAnnotations.push(response);
      this.finalResultChart.updateVis([this.finalResultData]);
      this.selectCnvs.next(this.finalResultData.cnvFragmentAnnotations);
    });
  }
}
