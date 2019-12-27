import { CnvToolResult } from './cnv-tool-result.model';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  Input
} from '@angular/core';
import * as d3 from 'd3';
import { Bar } from './chart.model';
import { color } from 'd3';

class CnvToolAnnotation {
  toolIdentity?: string; // cnv tool name and parameter.
  toolAnnotations?: CnvFragmentAnnotation[]; // annotation for a given cnv tool.
}
class CnvFragmentAnnotation {
  chromosome?: string;
  cnvType?: string;
  startBp?: number;
  endBp?: number;
  dgv?: string[]; // dgv.variant_accession
  ensembl?: string[]; // ensembl.gene_id
  clinvar;
}

@Component({
  selector: 'app-cnv-tool-chart',
  templateUrl: './cnv-tool-chart.component.html',
  styleUrls: ['./cnv-tool-chart.component.scss']
})
export class CnvToolChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];

  regionStartBp = 12000000;
  regionEndBp = 14000000;

  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef;

  constructor() {}
  ngOnChanges(): void {
    console.log(this.cnvTools);
    if (!this.cnvTools) {
      return;
    }
    this.createChart();
  }
  ngOnInit() {}
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

    // create scale on y
    const y = d3
      .scaleBand()
      .domain(this.cnvTools.map(tool => tool.toolIdentity))
      .range([0, contentHeight])
      .paddingInner(0.3);

    // define color for each bar
    const colors = d3
      .scaleOrdinal()
      .domain(this.cnvTools.map(tool => tool.toolIdentity))
      .range(d3.schemeCategory10);

    // generate yAxis
    const yAxis = d3.axisLeft(y);
    yAxisGroup.call(yAxis);

    // generate bars
    const bars = graph
      .selectAll('g.bar')
      .data(this.cnvTools)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('y', d => y(d.toolIdentity))
      .attr('fill', d => colors(d.toolIdentity) as string);

    // generate bar background
    const barBackground = bars
      .insert('rect', ':first-child')
      .attr('height', y.bandwidth)
      .attr('y', d => y(d.toolIdentity))
      .attr('x', '1')
      .attr('width', contentWidth)
      .attr('fill-opacity', '0.5')
      .style('fill', '#F5F5F5')
      .attr('class', 'bar--background');

    // generate sub bars
    const subbars = bars
      .selectAll('rect.subbar')
      .data(d => d.toolAnnotations)
      .enter()
      .append('rect')
      .attr('class', 'subbar')
      .attr('width', d => {
        let chosenStartBp: number;
        let chosenEndBp: number;
        if (
          d.endBp - this.regionStartBp > 0 &&
          this.regionStartBp - d.startBp >= 0
        ) {
          chosenStartBp = this.regionStartBp;
          chosenEndBp = d.endBp;
          return x(chosenEndBp) - x(chosenStartBp);
        } else if (
          this.regionEndBp - d.startBp > 0 &&
          d.endBp - this.regionEndBp >= 0
        ) {
          chosenStartBp = d.startBp;
          chosenEndBp = this.regionEndBp;
          return x(chosenEndBp) - x(chosenStartBp);
        } else if (
          d.startBp - this.regionStartBp > 0 &&
          this.regionEndBp - d.endBp > 0
        ) {
          chosenStartBp = d.startBp;
          chosenEndBp = d.endBp;
          return x(chosenEndBp) - x(chosenStartBp);
        }
      })

      .attr('x', d => x(d.startBp))
      .attr('height', y.bandwidth)
      .attr('y', function(d) {
        const parentData = d3
          .select(this.parentNode)
          .datum() as CnvToolAnnotation;
        return y(parentData.toolIdentity);
      })
      .on('mouseover', function(d) {
        tooltip.html(`<p>Tooltip text</p>`);

        // tooltip
        //   .select('text.range')
        //   .text(`Start - End: ${d.startBp} - ${d.endBp}`);
      })
      .on('mousemove', function() {
        const mousePosition = d3.mouse(this);
        const xTooltipPosition = mousePosition[0];
        const yTooltipPosition = mousePosition[1];

        // tooltip
        //   .transition()
        //   .duration(200)
        //   .style('opacity', 0.9);

        tooltip
          .style('left', xTooltipPosition + 'px')
          .style('top', yTooltipPosition + 'px')
          .style('display', 'block');
      })
      .on('mouseout', function() {
        tooltip.style('display', 'none');
      });

    // Prep the tooltip bits, initial display is hidden
    const tooltip = d3
      .select('#chart')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', '#D3D3D3')
      .style('padding', 6)
      .style('display', 'none');
  }
}
