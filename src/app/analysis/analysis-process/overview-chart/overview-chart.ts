import { chooseBasepair, filterDataInRegion } from './../visualizeBp.utility';
import * as d3 from 'd3';
import { CnvFragmentAnnotation } from '../../analysis.model';

export class OverviewChart {
  _parentElement; // string
  _data; // CnvFragmentAnnotation[] only merged_tool เพราะว่าเราต้องการดูที่ overlap
  graphContainer;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleLinear<number, number>;
  copyScaleX;
  xAxis;
  yAxis;
  domainOnX;
  domainOnY;

  /**
   * // get merged_tool
   * domainOnX = [1, chromosome.length - 1]
   * domainOnY = [0, this.cnvTools.length]
   */
  constructor(parentElement, data, containerMargin, domainOnX, domainOnY) {
    this._parentElement = parentElement;
    this._data = data;
    this.domainOnX = domainOnX;
    this.domainOnY = domainOnY;
    this.initVis(containerMargin, domainOnX, domainOnY);
  }
  private createGraphContainer(containerMargin) {
    // const parentElement = d3.select(this._parentElementName);
    // const width = parentElement.attr('width');
    // const height = parentElement.attr('height');
    // const y = parentElement.attr('y');
    const element = d3.select('div .overview');

    const width = this._parentElement.offsetWidth;
    const height = this._parentElement.offsetHeight;
    // select the svg container
    const svg = d3
      .select(this._parentElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const contentWidth = +width - containerMargin.left - containerMargin.right;
    const contentHeight =
      +height - containerMargin.top - containerMargin.bottom;

    this.graphContainer = svg
      .append('g')
      .attr('class', 'overview-graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr(
        'transform',
        `translate(${containerMargin.left}, ${containerMargin.top})`
      );
  }

  private generateScaleXY(domainOnX, domainOnY) {
    // create scale on x
    this.scaleX = d3
      .scaleLinear()
      .domain(domainOnX)
      .range([0, this.graphContainer.attr('width')]);

    // create scale on y
    this.scaleY = d3
      .scaleLinear()
      .domain(domainOnY)
      .range([this.graphContainer.attr('height'), 0]);

    this.copyScaleX = this.scaleX.copy();
  }

  private createAxes() {
    const xAxisGroup = this.graphContainer
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${this.graphContainer.attr('height')})`);
    const yAxisGroup = this.graphContainer
      .append('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(0, 0)`);

    // generate xAxis
    this.xAxis = d3.axisBottom(this.scaleX);
    xAxisGroup.call(this.xAxis);

    // generate yAxis
    this.yAxis = d3
      .axisLeft(this.scaleY)
      .ticks(this.domainOnY[1])
      .tickFormat((d: number) => {
        return `${d3.format(',d')(d)} tools`;
      });
    yAxisGroup.call(this.yAxis);
  }

  private createBars() {
    // generate bars (add data + color)
    const bars = this.graphContainer.append('g').attr('class', 'overview-bar');
    bars
      .selectAll('rect')
      .data(() => {
        return this._data;
      }) // get merged_tool
      .enter()
      .append('rect')
      .attr(
        'height',
        (d: CnvFragmentAnnotation) =>
          this.graphContainer.attr('height') -
          this.scaleY(d.overlapTools.length)
      )
      .attr('x', (d: CnvFragmentAnnotation) => this.scaleX(d.startBp))
      .attr('y', (d: CnvFragmentAnnotation) =>
        this.scaleY(d.overlapTools.length)
      )
      .attr(
        'width',
        (d: CnvFragmentAnnotation) =>
          this.scaleX(d.endBp) - this.scaleX(d.startBp) + 1
      )
      .attr('fill', 'red');
  }

  private brushed(callback) {
    // Get the selection coordinate
    const extent = d3.event.selection;
    if (extent) {
      const sx1 = Math.round(this.scaleX.invert(extent[0]));
      const sx2 = Math.round(this.scaleX.invert(extent[1]));
      callback(sx1, sx2);
    }
  }

  public createBrush(callback) {
    // Initialize brush component
    const brush = d3
      .brushX()
      .handleSize(10)
      .extent([
        [0, 0],
        [this.graphContainer.attr('width'), this.graphContainer.attr('height')]
      ])
      .on('end', () => this.brushed(callback));
    // Append brush component
    const brushComponent = this.graphContainer
      .append('g')
      .attr('class', 'brush')
      .call(brush);
  }

  private zoomed() {
    // update scaleX
    // this.scaleX.range([0, width].map(d => d3.event.transform.applyX(d)));

    this.scaleX = d3.event.transform.rescaleX(this.copyScaleX);

    // create new chart with new scaleX
    this.graphContainer
      .selectAll('.overview-bar rect')
      // .data(() => {
      //   return filterDataInRegion(
      //     this._data,
      //     this.scaleX.domain()[0],
      //     this.scaleX.domain()[1]
      //   );
      // }) // get merged_tool
      .attr('x', (d: CnvFragmentAnnotation) => this.scaleX(d.startBp))
      .attr(
        'width',
        (d: CnvFragmentAnnotation) =>
          this.scaleX(d.endBp) - this.scaleX(d.startBp) + 1
      );

    // create new xAxis with new scaleX
    this.graphContainer
      .selectAll('.overview .x-axis')
      .call(d3.axisBottom(this.scaleX));
    // return scaleX;
  }

  private createZoomScale() {
    const width = this.graphContainer.attr('width');
    const height = this.graphContainer.attr('height');
    const zoomScale = d3
      .zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([
        [0, 0],
        [width, height]
      ])
      .extent([
        [0, 0],
        [width, height]
      ])
      .on('zoom', () => {
        this.zoomed();
      });
    return zoomScale;
  }

  public initVis(maxTickLeft, domainOnX, domainOnY) {
    this.createGraphContainer(maxTickLeft);
    this.generateScaleXY(domainOnX, domainOnY);
    this.createAxes();

    this.graphContainer.call(this.createZoomScale());
    this.createBars();
  }
}
