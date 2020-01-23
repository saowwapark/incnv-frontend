import * as d3 from 'd3';
import { CnvGroup, CnvInfo } from 'src/app/analysis/analysis.model';
import { formatNumberWithComma } from 'src/app/utils/map.utils';
export class ComparedChart {
  _id: string;
  _parentElement; // angular native element
  _data: CnvGroup[];
  _domainOnY; // domainOnY = this.cnvTools.map(tool => tool.cnvGroupName) // set of tool id;
  _domainOnX; // domainOnX = [this.regionStartBp, this.regionEndBp]
  graphContainer;
  scaleX: d3.ScaleLinear<number, number>;
  scaleY: d3.ScaleBand<string>;
  colorScale;
  xAxis;
  yAxis;

  tooltip;
  subbars;
  svg;

  /**
   * // get merged_tool
   * domainOnX = [1, chromosome.length - 1]
   * domainOnY = [0, this.cnvTools.length]
   */
  constructor(
    id,
    parentElement,
    data: CnvGroup[],
    containerMargin,
    domainOnX,
    domainOnY
  ) {
    this._id = id;
    this._parentElement = parentElement;
    this._data = data;
    this._domainOnX = domainOnX;
    this._domainOnY = domainOnY;

    // this.domainOnY = domainOnY;
    this.initVis(containerMargin);
  }
  private generateGraphContainer(containerMargin) {
    const width = this._parentElement.offsetWidth;
    const height = this._parentElement.offsetHeight;

    console.log(this._parentElement.id);
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
      .range([0, this.graphContainer.attr('height')])
      .paddingInner(0.3)
      .paddingOuter(0.2);
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

  private createColorScale() {
    this.colorScale = d3
      .scaleOrdinal()
      .domain(this._domainOnY)
      .range(d3.schemeCategory10);
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
    const bars = area
      .selectAll('g.bar')
      .data(this._data)
      .join('g')
      .attr('class', 'bar')
      .attr('y', (d: CnvGroup) => this.scaleY(d.cnvGroupName));

    // generate bar background
    const barBackground = bars
      .insert('rect', ':first-child')

      .attr('height', this.scaleY.bandwidth)
      .attr('y', (d: CnvGroup) => this.scaleY(d.cnvGroupName))
      .attr('x', '1')
      .attr('width', this.graphContainer.attr('width'))
      .attr('fill-opacity', '0.5')
      .style('fill', '#F5F5F5')
      .attr('class', 'bar--background');
    return bars;
  }

  private generateSubbars(bars) {
    const subbars = bars

      .selectAll('rect.subbar')

      .data((d: CnvGroup) => {
        return d.cnvInfos;
      })
      .join('rect')
      .attr('class', 'subbar');

    subbars
      .attr('width', (d: CnvInfo) => {
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
      .attr('y', (d, i, n) => {
        const parentData = d3.select(n[i].parentNode).datum() as CnvGroup;
        return this.scaleY(parentData.cnvGroupName);
      })
      .attr('fill', (d: CnvInfo, i, n) => {
        const parentData: CnvGroup = d3
          .select(n[i].parentNode)
          .datum() as CnvGroup;
        const cnvGroupName = parentData.cnvGroupName;
        return this.colorScale(cnvGroupName) as string;
      })
      .attr('stroke', (d, i, n) => {
        const parentData = d3.select(n[i].parentNode).datum() as CnvGroup;
        return this.colorScale(parentData.cnvGroupName);
      })
      .attr('stroke-opacity', '0');

    return subbars;
  }

  public onClickSubbars(callback) {
    this.subbars.on('click', (d, i, n) => {
      const parentData = d3.select(n[i].parentNode).datum() as CnvGroup;
      callback(parentData.cnvGroupName, d);
    });
  }

  private addEventToSubbars() {
    // Add Events
    this.subbars
      .on('mouseover', (d, i, n) => {
        // change color subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', '#fff')
          .attr('stroke-opacity', '1')
          .style('cursor', 'pointer');
      })
      .on('mouseout', (d, i, n) => {
        // subbar
        d3.select(n[i])
          .transition()
          .duration(300)
          .attr('fill', () => {
            const parentData = d3.select(n[i].parentNode).datum() as CnvGroup;
            return this.colorScale(parentData.cnvGroupName);
          })
          .attr('stroke-opacity', '0');

        // tooltip
        this.tooltip.style('display', 'none');
      })
      .on('mousemove', (d, i, n) => {
        // tooltip
        this.tooltip
          .style('left', d3.mouse(n[i])[0] + 10 + 'px')
          .style('top', d3.mouse(n[i])[1] - 20 + 'px')
          .style('display', null);

        this.tooltip.html(() => {
          let content = `Chromosome ${d.chromosome}: ${formatNumberWithComma(
            d.startBp
          )} - ${formatNumberWithComma(d.endBp)}`;
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
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', '#D3D3D3')
      .style('color', '#313639')
      .style('text-align', 'center')
      .style('border-radius', '8px')
      .style('padding', '0.3rem 1rem')
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
    this.createColorScale();

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
