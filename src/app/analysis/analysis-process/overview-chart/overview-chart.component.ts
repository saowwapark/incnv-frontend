import { RegionBp } from './../../analysis.model';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import * as d3 from 'd3';
import { CnvTool, CnvInfo } from '../../analysis.model';
import { OverviewChart } from './overview-chart';
import { HUMAN_CHROMOSOME } from '../../chromosome.model';

@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvTool[];
  @Input() chr: string;
  @Input() height: number;
  @Output()
  selectChrRegion = new EventEmitter<RegionBp>();
  @Input() containerMargin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  @ViewChild('overviewChartDiv', { static: true })
  private overviewChartDiv: ElementRef;

  private overviewChart;

  chrLength: number;

  mergedToolId = 'merged tools';
  svg: d3.Selection<SVGSVGElement, CnvTool, null, undefined>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    // const chartWidth = event.target.innerWidth;
    if (this.overviewChart) {
      this.createOverviewChart();
    }
  }
  constructor() {}
  ngOnChanges(): void {
    if (!this.cnvTools) {
      return;
    }

    if (this.chr) {
      this.chrLength = HUMAN_CHROMOSOME[`chr${this.chr.toUpperCase()}`].length;
      this.createOverviewChart();
    }
  }
  ngOnInit() {}

  createOverviewChart() {
    if (this.overviewChart) {
      this.overviewChart.removeVis();
    }
    this.overviewChart = new OverviewChart(
      this.overviewChartDiv.nativeElement,
      this.cnvTools[this.cnvTools.length - 1].cnvInfos,
      this.containerMargin,
      [1, this.chrLength - 1],
      [0, this.cnvTools.length - 1]
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
