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
import { CnvToolAnnotation, CnvFragmentAnnotation } from '../../analysis.model';
import { OverviewChart } from './overview-chart';
@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];
  @Input() chr: string;
  @Input() height: number;
  @Output()
  selectRegionBp = new EventEmitter<{
    regionStartBp: number;
    regionEndBp: number;
  }>();

  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef;

  chrLength = 248956422;

  chartWidth: number;
  mergedToolIdentity = 'merged tools';
  svg: d3.Selection<SVGSVGElement, CnvToolAnnotation, null, undefined>;

  constructor() {}
  ngOnChanges(): void {
    if (!this.cnvTools) {
      return;
    }

    const chart = new OverviewChart(
      this.chartContainer.nativeElement,
      this.cnvTools[this.cnvTools.length - 1].cnvFragmentAnnotations,
      8,
      [1, this.chrLength - 1],
      [0, this.cnvTools.length - 1]
    );

    chart.createBrush((sx1, sx2) => {
      this.callback(sx1, sx2);
    });
  }
  ngOnInit() {}

  private callback(sx1, sx2) {
    this.selectRegionBp.next({ regionStartBp: sx1, regionEndBp: sx2 });
  }
}
