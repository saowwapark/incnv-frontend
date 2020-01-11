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
  SimpleChanges
} from '@angular/core';
import {
  CnvToolAnnotation,
  CnvFragmentAnnotation,
  RegionBp,
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
  @Input() selectedRegion: RegionBp;
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Input() tableCnvs: CnvFragmentAnnotation[];

  @Output() selectCnvs = new EventEmitter<CnvFragmentAnnotation[]>();

  @ViewChild('mergedChartDiv', { static: true })
  private mergedChartDiv: ElementRef;
  @ViewChild('finalResultChartDiv', { static: true })
  private finalResultChartDiv: ElementRef;

  mergedChart;
  finalResultChart;

  finalResultData: CnvToolAnnotation;

  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;
    this.createMergedChart();
    // this.createFinalResultChart();
  }

  constructor(private _matDialog: MatDialog) {
    this.finalResultData = new CnvToolAnnotation();
    this.finalResultData.cnvToolIdentity = FINAL_RESULT_IDENTITY;
    this.finalResultData.cnvFragmentAnnotations = [];
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.cnvTools) {
      return;
    }

    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedRegion':
            this.createMergedChart();
            //this.createFinalResultChart();
            break;
          case 'tableCnvs':
            if (this.tableCnvs) {
              this.finalResultData.cnvFragmentAnnotations = this.tableCnvs;
              break;
            }
        }
      }
    }
  }
  ngOnInit() {}

  createMergedChart() {
    if (this.mergedChart) {
      this.mergedChart.removeVis();
    }
    this.mergedChart = new MergedChart(
      '1',
      this.mergedChartDiv.nativeElement,
      this.cnvTools,
      this.containerMargin,
      [this.selectedRegion.startBp, this.selectedRegion.endBp],
      this.cnvTools.map(tool => tool.cnvToolIdentity)
    );

    this.mergedChart.onClickSubbars((cnvToolIdentity, data) => {
      this.createDialog(cnvToolIdentity, data);
    });
  }

  createFinalResultChart() {
    if (this.finalResultChart) {
      this.finalResultChart.removeVis();
    }
    this.finalResultChart = new FinalResultChart(
      this.finalResultChartDiv.nativeElement,
      [this.finalResultData],
      this.containerMargin,
      [this.selectedRegion.startBp, this.selectedRegion.endBp],
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
