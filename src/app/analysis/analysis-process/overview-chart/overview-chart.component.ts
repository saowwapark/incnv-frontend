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
@Component({
  selector: 'app-overview-chart',
  templateUrl: './overview-chart.component.html',
  styleUrls: ['./overview-chart.component.scss']
})
export class OverviewChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];
  @Input() chr: string;
  @Input() height: number;
  @Input() topMargin: number;
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chartWidth = event.target.innerWidth;
    this.updateChart();
  }

  constructor() {}
  ngOnChanges(): void {
    if (!this.cnvTools) {
      return;
    }
    this.createChart();
  }
  ngOnInit() {}

  /**
   * Main Function
   */
  private createChart(): void {
    // create graph (graph consists of xAxis, yAxis, chart)
    this.svg = this.createSvg();
    const containerMargin = this.calContainerMargin();
    const graphContainer = this.createGraphContainer(this.svg, containerMargin);
    const [scaleX, scaleY] = this.createScaleXY(graphContainer);
    this.generateAxes(graphContainer, scaleX, scaleY);

    const bars = this.createBars(graphContainer, scaleX, scaleY);
    this.createBrush(graphContainer, scaleX);
  }

  /**
   * Sub Function
   */
  private updateChart() {
    this.svg.remove();
    this.createChart();
  }

  private brushed(scaleX) {
    // Get the selection coordinate
    const selection = d3.event.selection;
    const sx1 = Math.round(scaleX.invert(selection[0][0]));
    const sx2 = Math.round(scaleX.invert(selection[1][0]));
    this.selectRegionBp.next({ regionStartBp: sx1, regionEndBp: sx2 });
  }

  private createBrush(graphContainer, scaleX) {
    // Initialize brush component
    const brush = d3
      .brush()
      .handleSize(10)
      .extent([
        [0, 0],
        [graphContainer.attr('width'), graphContainer.attr('height')]
      ])
      .on('brush', (d, i, n) => {
        this.brushed(scaleX);
      });
    // Append brush component
    const brushComponent = graphContainer
      .append('g')
      .attr('class', 'brush')
      .call(brush);
  }
  private createSvg(): d3.Selection<
    SVGSVGElement,
    CnvToolAnnotation,
    null,
    undefined
  > {
    // select the svg container
    const element = this.chartContainer.nativeElement;
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', this.height)
      .attr('y', this.topMargin);
    return svg;
  }

  private createScaleXY(
    graphContainer
  ): [d3.ScaleLinear<number, number>, d3.ScaleLinear<number, number>] {
    // create scale on x
    const scaleX = d3
      .scaleLinear()
      .domain([1, this.chrLength - 1])
      .range([0, graphContainer.attr('width')]);

    // create scale on y
    const scaleY = d3
      .scaleLinear()
      .domain([0, this.cnvTools.length - 1])
      .range([graphContainer.attr('height'), 0]);

    return [scaleX, scaleY];
  }

  private generateAxes(graphContainer, scaleX, scaleY) {
    console.log(graphContainer);
    const xAxisGroup = graphContainer
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${graphContainer.attr('height')})`);
    const yAxisGroup = graphContainer
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(0, 0)`);

    // generate xAxis
    const xAxis = d3.axisBottom(scaleX);
    xAxisGroup.call(xAxis);

    // generate yAxis
    const yAxis = d3
      .axisLeft(scaleY)
      .ticks(this.cnvTools.length - 1)
      .tickFormat((d: number) => {
        return `${d3.format(',d')(d)} tools`;
      });
    yAxisGroup.call(yAxis);
  }

  private createBars(graphContainer, scaleX, scaleY) {
    // generate bars (add data + color)
    const bars = graphContainer.append('g').attr('class', 'overview-bar');
    bars
      .selectAll('rect')
      .data(this.cnvTools[this.cnvTools.length - 1].cnvToolAnnotations) // get merged_tool
      .enter()
      .append('rect')
      .attr(
        'height',
        (d: CnvFragmentAnnotation) =>
          graphContainer.attr('height') - scaleY(d.overlapTools.length)
      )
      .attr('x', (d: CnvFragmentAnnotation) => scaleX(d.startBp))
      .attr('y', (d: CnvFragmentAnnotation) => scaleY(d.overlapTools.length))
      .attr(
        'width',
        (d: CnvFragmentAnnotation) => scaleX(d.endBp) - scaleX(d.startBp) + 1
      )
      .attr('fill', 'red');
  }

  private calContainerMargin() {
    // max character lenght
    let maxLength = 0;
    for (const tool of this.cnvTools) {
      const length = tool.cnvToolIdentity.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    // create margins and dimensions
    const containerMargin = {
      top: 40,
      right: 40,
      bottom: 30,
      left: 10 * maxLength
    };
    return containerMargin;
  }
  private createGraphContainer(svg, containerMargin) {
    const contentWidth =
      svg.attr('width') - containerMargin.left - containerMargin.right;
    const contentHeight =
      svg.attr('height') - containerMargin.top - containerMargin.bottom;

    svg
      .append('g')
      .attr('class', 'overview-graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr(
        'transform',
        `translate(${containerMargin.left}, ${containerMargin.top})`
      );
    return d3.select('.overview-graph-container');
  }
}
