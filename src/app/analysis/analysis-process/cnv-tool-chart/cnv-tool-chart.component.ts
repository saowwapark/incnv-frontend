import { CnvToolResult } from './cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges
} from '@angular/core';
import * as d3 from 'd3';
import { Bar } from './chart.model';
import { color } from 'd3';

@Component({
  selector: 'app-cnv-tool-chart',
  templateUrl: './cnv-tool-chart.component.html',
  styleUrls: ['./cnv-tool-chart.component.scss']
})
export class CnvToolChartComponent implements OnInit, OnChanges {
  // @Input() data: CnvToolResult[];
  // @Input() startRegion: number;
  // @Input() stopRegion: number;

  // data: CnvToolResult[];
  regionStartBp = 12000000;
  regionEndBp = 14000000;

  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef;

  constructor() {}
  ngOnChanges(): void {
    // if (!this.data) {
    //   return;
    // }
    // this.createChart();
  }
  ngOnInit() {
    this.createChart();
  }
  private createChart(): void {
    // select the svg container
    const element = this.chartContainer.nativeElement;
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // create margins and dimensions
    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };
    const contentWidth = element.offsetWidth - margin.left - margin.right;
    const contentHeight = element.offsetHeight - margin.top - margin.bottom;

    // create graph (graph consists of xAxis, yAxis, chart)
    const graph = svg
      .append('g')
      .attr('class', 'graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    const xAxisGroup = graph.append('g').attr('class', 'x-axis');
    const yAxisGroup = graph.append('g').attr('class', 'y-axis');

    // create scale on x
    const x = d3
      .scaleLinear()
      .domain([this.regionStartBp, this.regionEndBp])
      .range([0, contentWidth]);

    // generate xAxis
    const xAxis = d3.axisTop(x);
    xAxisGroup.call(xAxis);

    d3.json('assets/many_chr1_dup_NA10847.json').then((barDatas: Bar[]) => {
      // create scale on y
      const y = d3
        .scaleBand()
        .domain(barDatas.map(item => item.name))
        .range([0, contentHeight])
        .paddingInner(0.3);

      const colors = d3
        .scaleOrdinal()
        .domain(barDatas.map(item => item.name))
        .range(d3.schemeCategory10);
      // generate yAxis
      const yAxis = d3.axisLeft(y);
      yAxisGroup.call(yAxis);

      // generate bars
      const bars = graph
        .selectAll('g.bar')
        .data(barDatas)
        .enter()
        .append('g')
        .attr('class', 'bar')
        .attr('y', d => y(d.name))
        .attr('fill', d => colors(d.name) as string)
        .on('mouseover', function() {
          tooltip.style('display', null);
        })
        .on('mouseout', function() {
          tooltip.style('display', 'none');
        })
        .on('mousemove', function(d) {
          console.log(this);
          const mousePosition = d3.mouse(this);

          const xPosition = mousePosition[0];

          const xTooltipPosition = mousePosition[0];
          const yTooltipPosition = mousePosition[1];
          tooltip.attr(
            'transform',
            'translate(' + xTooltipPosition + ',' + yTooltipPosition + ')'
          );
          tooltip.select('text').text(Math.round(x.invert(xPosition)));
        });
      // generate bar background
      const barBackground = bars
        .insert('rect', ':first-child')
        .attr('height', y.bandwidth)
        .attr('y', d => y(d.name))
        .attr('x', '1')
        .attr('width', contentWidth)
        .attr('fill-opacity', '0.5')
        .style('fill', '#F5F5F5')
        .attr('class', 'bar--background');

      // generate sub bars
      const subbars = bars
        .selectAll('rect.subbar')
        .data(d => d.data)
        .enter()
        .append('rect')
        .attr('class', 'subbar')
        .attr('width', d => {
          let chosenStartBp: number;
          let chosenEndBp: number;
          if (
            d.endBasepair - this.regionStartBp > 0 &&
            this.regionStartBp - d.startBasepair >= 0
          ) {
            chosenStartBp = this.regionStartBp;
            chosenEndBp = d.endBasepair;
            return x(chosenEndBp) - x(chosenStartBp);
          } else if (
            this.regionEndBp - d.startBasepair > 0 &&
            d.endBasepair - this.regionEndBp >= 0
          ) {
            chosenStartBp = d.startBasepair;
            chosenEndBp = this.regionEndBp;
            return x(chosenEndBp) - x(chosenStartBp);
          } else if (
            d.startBasepair - this.regionStartBp > 0 &&
            this.regionEndBp - d.endBasepair > 0
          ) {
            chosenStartBp = d.startBasepair;
            chosenEndBp = d.endBasepair;
            return x(chosenEndBp) - x(chosenStartBp);
          }
        })

        .attr('x', d => x(d.startBasepair))
        .attr('height', y.bandwidth)
        .attr('y', function(d) {
          const parentData = d3.select(this.parentNode).datum() as Bar;
          return y(parentData.name);
        });
    });

    // Prep the tooltip bits, initial display is hidden
    const tooltip = svg
      .append('g')
      .attr('class', 'tooltip')
      .style('display', 'none');

    tooltip
      .append('rect')
      .attr('width', 60)
      .attr('height', 20)
      .attr('fill', 'white')
      .style('opacity', 0.5);

    tooltip
      .append('text')
      .attr('x', 30)
      .attr('dy', '1.2em')
      .style('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold');
  }
}
