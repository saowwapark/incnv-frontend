import * as d3 from 'd3';
import { DgvVariant } from 'src/app/analysis/analysis.model';
import { formatNumberWithComma } from 'src/app/utils/map.utils';
import { filterDataInRegion } from '../visualizeBp.utility';

export class DgvChart {
  _id: string;
  _parentElement; // angular native element
  _data: DgvVariant[];
  _domainOnY: string[]; // domainOnY = this.cnvTools.map(tool => tool.cnvGroupName) // set of tool id;
  _domainOnX: number[]; // domainOnX = [this.regionStartBp, this.regionEndBp]
  _color: string;
  graphContainer;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleBand<string>;
  xAxis;
  yAxis;

  tooltip;
  subbars;
  svg;

  /**
   * // get merged_tool
   * domainOnX = [regionStartBp, regionEndBp]
   * domainOnY = [0, this.cnvTools.length]
   */
  constructor(
    id,
    parentElement,
    data: DgvVariant[],
    containerMargin,
    domainOnX: number[],
    domainOnY: string[],
    color: string
  ) {
    this._id = id;
    this._parentElement = parentElement;

    this._data = filterDataInRegion(data, domainOnX[0], domainOnX[1]);
    this._domainOnX = domainOnX;
    this._domainOnY = domainOnY;
    this._color = color;

    // this.domainOnY = domainOnY;
    this.initVis(containerMargin);
  }
  private calContainerHeight(containerMargin) {
    const barNumber = 1;
    const xAxisBarHeight = 20;
    const dataBarHeight = 30; // approximately with inner padding
    const innerPaddingHeight = 0.3 * dataBarHeight;
    const innerPaddingNumber = 0;
    const outterPaddingHeight = 0.2 * dataBarHeight;
    return (
      containerMargin.top +
      containerMargin.bottom +
      xAxisBarHeight +
      barNumber * dataBarHeight
      // innerPaddingHeight * innerPaddingNumber +
      // 2 * outterPaddingHeight
    );
  }

  private generateGraphContainer(containerMargin) {
    const width = this._parentElement.offsetWidth;
    const height = this.calContainerHeight(containerMargin);

    // select the svg container
    this.svg = d3
      .select(this._parentElement)
      .append('svg')
      .attr('id', this._id)
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

    // clip path
    this.graphContainer
      .append('clipPath')
      .attr('id', `clip-${this._id}`)
      .append('rect')
      .attr('width', this.graphContainer.attr('width'))
      .attr('height', this.graphContainer.attr('height'));
  }

  private createScaleX() {
    this.scaleX = d3
      .scaleLinear()
      .domain(this._domainOnX)
      .range([0, this.graphContainer.attr('width')]);
  }
  private createScaleY() {
    this.scaleY = d3
      .scaleBand()
      .domain(this._domainOnY)
      .range([0, this.graphContainer.attr('height')]);
  }

  private generateAxisX() {
    const xAxisGroup = this.graphContainer.append('g').attr('class', 'x-axis');
    // generate xAxis
    const xAxis = d3.axisTop(this.scaleX);
    // .tickFormat(d3.format('.4s'));
    xAxisGroup.call(xAxis);
  }

  private generateAxisY() {
    const yAxisGroup = this.graphContainer.append('g').attr('class', 'y-axis');

    // generate yAxis
    const yAxis = d3.axisLeft(this.scaleY);
    yAxisGroup.call(yAxis);
  }

  public drawData() {
    const bars = this.generateBars();
    this.subbars = this.generateSubbars(bars);
    this.addEventToSubbars();
  }

  private generateBars() {
    const area = this.graphContainer
      .append('g')
      .attr('clip-path', 'url(#clip-' + this._id + ')');

    // generate bars (add data + color)
    const bar = area
      .append('g')
      .attr('class', 'bar')
      .attr('y', '1');

    // generate bar background
    const barBackground = bar
      .insert('rect', ':first-child')

      .attr('height', this.scaleY.bandwidth)
      .attr('y', '1')
      .attr('x', '1')
      .attr('width', this.graphContainer.attr('width'))
      .attr('fill-opacity', '0.5')
      .style('fill', '#F5F5F5')
      .attr('class', 'bar--background');
    return bar;
  }

  private generateSubbars(bars) {
    const subbars = bars

      .selectAll('rect.subbar')

      .data(this._data)
      .join('rect')
      .attr('class', 'subbar');

    subbars
      .attr('width', (d: DgvVariant) => {
        if (d.startBp && d.endBp) {
          return this.scaleX(d.endBp) - this.scaleX(d.startBp) + 1;
        }
      })
      .attr('x', d => {
        if (d.startBp) {
          return this.scaleX(d.startBp);
        }
      })
      .attr('height', this.scaleY.bandwidth)
      .attr('y', '1')
      .attr('fill', this._color)
      .attr('stroke', this._color)
      .attr('stroke-opacity', '0');

    return subbars;
  }

  private addEventToSubbars() {
    // Add Events
    this.subbars
      .on('mouseover', (d: DgvVariant, i, n) => {
        // change color subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', '#fff')
          .attr('stroke-opacity', '1')
          .style('cursor', 'pointer');
      })
      .on('mouseout', (d: DgvVariant, i, n) => {
        // subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', this._color)
          .attr('stroke-opacity', '0');

        // tooltip
        this.tooltip.style('display', 'none');
      })
      .on('mousemove', (d: DgvVariant, i, n) => {
        // tooltip
        this.tooltip
          .style('left', d3.mouse(n[i])[0] + 10 + 'px')
          .style('top', d3.mouse(n[i])[1] - 80 + 'px')
          .style('display', null);

        this.tooltip.html(() => {
          let content = `Chromosome ${d.chromosome}: ${formatNumberWithComma(
            d.startBp
          )} - ${formatNumberWithComma(d.endBp)}`;
          content += '<br>' + `variant: ${d.variantAccession}`;
          content += '<br>' + `variant type: ${d.variantType}`;
          content += '<br>' + `variant subtype: ${d.variantSubtype}`;
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
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#D3D3D3')
      .style('color', '#313639')
      .style('text-align', 'left')
      .style('border-radius', '8px')
      .style('padding', '0.3em 1em')
      .style('font-size', '1.3rem')
      .style('display', 'none')
      .style('z-index', '10');
  }

  public initVis(containerMargin) {
    this.generateGraphContainer(containerMargin);
    this.createScaleX();
    this.createScaleY();
    this.generateAxisX();
    this.generateAxisY();

    this.generateTooltip();
    this.drawData();
  }

  public updateVis(newData, newDomainOnX) {
    this._data = newData;
    this._domainOnX = newDomainOnX;
    this.createScaleX();
    this.generateAxisX();
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
}