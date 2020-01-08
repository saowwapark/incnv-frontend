import * as d3 from 'd3';
import {
  FINAL_RESULT_IDENTITY,
  CnvToolAnnotation,
  CnvFragmentAnnotation
} from '../../analysis.model';
import { filterDataInRegion } from '../visualizeBp.utility';

export class FinalResultChart {
  _parentElement; // angular native element
  _data: CnvToolAnnotation[];
  graphContainer;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleBand<string>;
  colorScale;
  xAxis;
  yAxis;
  _domainOnY; // domainOnY = this.cnvTools.map(tool => tool.cnvToolIdentity) // set of tool identity;
  _domainOnX; // domainOnX = [this.regionStartBp, this.regionEndBp]
  maxOverlap;
  tooltip;
  bars;
  subbars;
  svg;

  /**
   * // get merged_tool
   * domainOnX = [1, chromosome.length - 1]
   * domainOnY = [0, this.cnvTools.length]
   */
  constructor(
    parentElement,
    data,
    containerMargin,
    domainOnX,
    domainOnY,
    maxOverlap
  ) {
    this._parentElement = parentElement;
    this._data = data;
    this._domainOnX = domainOnX;
    this._domainOnY = domainOnY;
    this.maxOverlap = maxOverlap;

    // this.domainOnY = domainOnY;
    this.initVis(containerMargin);
  }
  private generateGraphContainer(containerMargin) {
    const width = this._parentElement.offsetWidth;
    const height = this._parentElement.offsetHeight;

    // select the svg container
    this.svg = d3
      .select(this._parentElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const contentWidth = +width - containerMargin.left - containerMargin.right;
    const contentHeight =
      +height - containerMargin.top - containerMargin.bottom;

    this.graphContainer = this.svg
      .append('g')
      .attr('class', 'graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr(
        'transform',
        `translate(${containerMargin.left}, ${containerMargin.top})`
      );
  }

  // update
  private createScaleX() {
    this.scaleX = d3
      .scaleLinear()
      .domain(this._domainOnX)
      .range([0, this.graphContainer.attr('width')]);
  }

  // fix
  private createScaleY() {
    this.scaleY = d3
      .scaleBand()
      .domain(this._domainOnY)
      .range([0, this.graphContainer.attr('height')])
      .paddingInner(0.3)
      .paddingOuter(0.2);
  }

  private generateAxes() {
    const xAxisGroup = this.graphContainer.append('g').attr('class', 'x-axis');
    const yAxisGroup = this.graphContainer.append('g').attr('class', 'y-axis');

    // generate xAxis
    const xAxis = d3.axisTop(this.scaleX);
    // .tickFormat(d3.format('.4s'));
    xAxisGroup.call(xAxis);

    // generate yAxis
    const yAxis = d3.axisLeft(this.scaleY);
    yAxisGroup.call(yAxis);
  }

  private createColorScale() {
    this.colorScale = d3
      .scaleOrdinal()
      .domain(this._domainOnY)
      .range(d3.schemeCategory10);
  }

  private createMergedColorScale(color) {
    return d3
      .scaleLinear<string>()
      .domain([0, this.maxOverlap]) // 0 to maximum overlaped cnv tool
      .range(['white', color]);
  }

  public drawData() {
    this.generateBars();
    const mergedColorScale = this.createMergedColorScale(
      this.colorScale(FINAL_RESULT_IDENTITY)
    );
    this.subbars = this.generateSubbars(mergedColorScale);
    this.addEventToSubbars(mergedColorScale);
  }

  private generateBars() {
    // generate bars (add data + color)
    this.bars = this.graphContainer
      .selectAll('g.bar')
      .data(this._data)
      .join('g')
      .attr('class', 'bar')
      .attr('y', d => this.scaleY(d.cnvToolIdentity));

    // generate bar background
    const barBackground = this.bars
      .insert('rect', ':first-child')
      .attr('height', this.scaleY.bandwidth)
      .attr('y', d => this.scaleY(d.cnvToolIdentity))
      .attr('x', '1')
      .attr('width', this.graphContainer.attr('width'))
      .attr('fill-opacity', '0.5')
      .style('fill', '#F5F5F5')
      .attr('class', 'bar--background');
  }

  private generateSubbars(mergedColorScale) {
    const subbars = this.bars
      .selectAll('rect.subbar')
      .data((d: CnvToolAnnotation) => {
        return filterDataInRegion(
          d.cnvFragmentAnnotations,
          this._domainOnX[0],
          this._domainOnX[1]
        );
      })
      .enter()
      .append('rect')
      .attr('class', 'subbar')
      .attr('width', (d: CnvFragmentAnnotation) => {
        return (
          this.scaleX(d.endBpOnRegion) - this.scaleX(d.startBpOnRegion) + 1
        );
      })
      .attr('x', d => this.scaleX(d.startBpOnRegion))
      .attr('height', this.scaleY.bandwidth)
      .attr('y', (d, i, n) => {
        const parentData = d3
          .select(n[i].parentNode)
          .datum() as CnvToolAnnotation;
        return this.scaleY(parentData.cnvToolIdentity);
      })
      .attr('fill', (d: CnvFragmentAnnotation, i, n) => {
        const parentData: CnvToolAnnotation = d3
          .select(n[i].parentNode)
          .datum() as CnvToolAnnotation;
        const cnvToolIdentity = parentData.cnvToolIdentity;
        let color = this.colorScale(cnvToolIdentity) as string;
        if (cnvToolIdentity === FINAL_RESULT_IDENTITY) {
          color = mergedColorScale(d.overlapTools.length);
        }
        return color;
      });
    return subbars;
  }

  public onClickSubbars(callback) {
    this.subbars.on('click', (d, i, n) => {
      const parentData = d3
        .select(n[i].parentNode)
        .datum() as CnvToolAnnotation;
      callback(parentData.cnvToolIdentity, d);
    });
  }

  private addEventToSubbars(mergedColorScale) {
    // Add Events
    this.subbars
      .on('mouseover', (d, i, n) => {
        // change color subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', '#fff');
      })
      .on('mouseout', (d, i, n) => {
        // subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', () => {
            const parentData = d3
              .select(n[i].parentNode)
              .datum() as CnvToolAnnotation;
            const cnvToolIdentity = parentData.cnvToolIdentity;
            let color = this.colorScale(parentData.cnvToolIdentity);
            if (cnvToolIdentity === FINAL_RESULT_IDENTITY) {
              color = mergedColorScale(d.overlapTools.length);
            }
            return color;
          });

        // tooltip
        this.tooltip.style('display', 'none');
      })
      .on('mousemove', d => {
        // tooltip
        const menuHeight = 64;

        this.tooltip
          .style('left', d3.event.clientX + 20 + 'px')
          .style('top', d3.event.clientY - menuHeight - 20 + 'px')
          .style('display', null);

        this.tooltip.html(() => {
          let content = `<p>Chromosome ${d.chromosome}: ${d.startBp} - ${d.endBp}</p>`;
          content += ``;
          return content;
        });
      });
  }

  private generateTooltip() {
    // Prep the tooltip bits, initial display is hidden
    this.tooltip = d3
      .select(this._parentElement)
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', '#D3D3D3')
      .style('padding', '6px')
      .style('display', 'none')
      .style('z-index', '10');
  }

  public initVis(maxTickLeft) {
    this.generateGraphContainer(maxTickLeft);
    this.createScaleX();
    this.createScaleY();
    this.generateAxes();
    this.createColorScale();

    this.generateTooltip();
    this.drawData();
  }

  public removeVis() {
    if (this.svg) {
      this.svg.remove();
    }
    if (this.tooltip) {
      this.tooltip.remove();
    }
  }

  public updateVis(newData: CnvToolAnnotation[]) {
    // join new data
    // this.bars.data(newData);
    this._data = newData;
    this.drawData();
  }
}
