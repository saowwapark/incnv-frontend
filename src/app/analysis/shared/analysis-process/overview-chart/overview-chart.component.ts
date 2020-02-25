import { RegionBp } from '../../../analysis.model';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import * as d3 from 'd3';
import { CnvGroup, CnvInfo } from '../../../analysis.model';
import { OverviewChart } from './overview-chart';
import { HUMAN_CHROMOSOME } from '../../../chromosome.model';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewChartComponent implements OnInit, OnChanges {
  readonly color = '#d32f2f';
  @Input() mergedData: CnvGroup;
  @Input() chromosome: string;
  @Input() yAxisUnit: string;
  @Input() yAxisMaxVaule: number;
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  @Output()
  selectChrRegion = new EventEmitter<RegionBp>();

  @ViewChild('overviewChartDiv', { static: true })
  private overviewChartDiv: ElementRef;
  private overviewChart;

  chrLength: number;

  svg: d3.Selection<SVGSVGElement, CnvGroup, null, undefined>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;
    if (this.overviewChart) {
      this.createOverviewChart();
    }
  }

  constructor() {}

  /********************* Life Cycle Hook ********************/
  ngOnChanges(): void {
    if (!this.mergedData) {
      return;
    }

    if (this.chromosome) {
      this.chrLength =
        HUMAN_CHROMOSOME[`chr${this.chromosome.toUpperCase()}`].length;
      this.createOverviewChart();
    }
  }
  ngOnInit() {}

  /*********************** Function **********************/
  createOverviewChart() {
    if (this.overviewChart) {
      this.overviewChart.removeVis();
    }
    this.overviewChart = new OverviewChart(
      this.overviewChartDiv.nativeElement,
      this.mergedData.cnvInfos,

      this.containerMargin,
      this.yAxisUnit,
      [1, this.chrLength - 1],
      [0, this.yAxisMaxVaule],
      this.color
    );

    this.overviewChart.createBrush((sx1, sx2) => {
      this.callback(sx1, sx2);
    });
  }

  private callback(sx1, sx2) {
    const selectedChrRegion = new RegionBp(sx1, sx2);
    this.selectChrRegion.next(selectedChrRegion);
  }
}
