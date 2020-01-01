import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  Input
} from '@angular/core';
import * as d3 from 'd3';
import { CnvToolAnnotation, CnvFragmentAnnotation } from '../../analysis.model';
import { AnnotationDialogComponent } from './annotation-dialog/annotation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-cnv-tool-chart',
  templateUrl: './cnv-tool-chart.component.html',
  styleUrls: ['./cnv-tool-chart.component.scss']
})
export class CnvToolChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];
  @ViewChild('chart', { static: true })
  private chartContainer: ElementRef;

  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  regionStartBp = 13000000;
  regionEndBp = 14000000;

  constructor(private _matDialog: MatDialog) {}
  ngOnChanges(): void {
    console.log(this.cnvTools);
    if (!this.cnvTools) {
      return;
    }
    this.createChart();
  }
  ngOnInit() {}

  private createDialog(
    cnvToolIdentity: string,
    cnvFragmentAnnotation: CnvFragmentAnnotation
  ) {
    this.dialogRef = this._matDialog.open(AnnotationDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        cnvToolIdentity: cnvToolIdentity,
        cnvFragmentAnnotation: cnvFragmentAnnotation
      }
    });
  }
  private createGraphContainer(svg) {
    // create margins and dimensions
    const margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };
    const contentWidth = svg.attr('width') - margin.left - margin.right;
    const contentHeight = svg.attr('height') - margin.top - margin.bottom;

    svg
      .append('g')
      .attr('class', 'graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr('transform', `translate(${margin.left}, ${margin.top})`);
    return d3.select('.graph-container');
  }
  private createSvg(): d3.Selection<SVGSVGElement, unknown, null, undefined> {
    // select the svg container
    const element = this.chartContainer.nativeElement;
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);
    return svg;
  }

  private createScales(
    graphContainer
  ): [d3.ScaleLinear<number, number>, d3.ScaleBand<string>] {
    // create scale on x
    const scaleX = d3
      .scaleLinear()
      .domain([this.regionStartBp, this.regionEndBp])
      .range([0, graphContainer.attr('width')]);

    // create scale on y
    const scaleY = d3
      .scaleBand()
      .domain(this.cnvTools.map(tool => tool.cnvToolIdentity))
      .range([0, graphContainer.attr('height')])
      .paddingInner(0.3);

    return [scaleX, scaleY];
  }

  private chooseBasepair(
    cnv: CnvFragmentAnnotation,
    regionStartBp,
    regionEndBp
  ) {
    let chosenStartBp: number;
    let chosenEndBp: number;

    const diffStart = cnv.startBp - this.regionStartBp;
    const diffEnd = cnv.endBp - this.regionEndBp;
    const diffEndStart = cnv.endBp - this.regionStartBp;
    const diffStartEnd = cnv.startBp - this.regionEndBp;
    // choose cnv in region
    // left region
    if (diffEndStart > 0 && diffStart <= 0) {
      chosenStartBp = this.regionStartBp;
      chosenEndBp = cnv.endBp;
    } else if (
      (diffEndStart === 0 && diffStart < 0) ||
      (cnv.startBp === cnv.endBp && cnv.startBp === this.regionStartBp)
    ) {
      chosenStartBp = this.regionStartBp;
      chosenEndBp = this.regionStartBp;
    }
    // right region
    else if (diffEnd >= 0 && diffStartEnd < 0) {
      chosenStartBp = cnv.startBp;
      chosenEndBp = this.regionEndBp;
    } else if (
      diffStartEnd === 0 &&
      diffEnd > 0 &&
      cnv.startBp === cnv.endBp &&
      cnv.startBp === this.regionEndBp
    ) {
      chosenStartBp = this.regionEndBp;
      chosenEndBp = this.regionEndBp;
    }
    // within region
    else if (diffStart > 0 && diffEnd < 0) {
      chosenStartBp = cnv.startBp;
      chosenEndBp = cnv.endBp;
    }
    // over region
    else if (
      (diffStart === 0 && diffEnd === 0) ||
      (diffStart < 0 && diffEnd > 0)
    ) {
      chosenStartBp = this.regionStartBp;
      chosenEndBp = this.regionEndBp;
    }
    return { startBp: chosenStartBp, endBp: chosenEndBp };
  }
  private filterDataInRegion(
    regionStartBp: number,
    regionEndBp: number,
    cnvToolAnnotations: CnvFragmentAnnotation[]
  ) {
    const data: CnvFragmentAnnotation[] = [];
    for (const cnv of cnvToolAnnotations) {
      // choose data in region
      if (
        (cnv.startBp >= regionStartBp && cnv.startBp <= regionEndBp) ||
        (cnv.endBp >= regionStartBp && cnv.endBp <= regionEndBp)
      ) {
        const { startBp, endBp } = this.chooseBasepair(
          cnv,
          regionStartBp,
          regionEndBp
        );
        cnv.startBpOnRegion = startBp;
        cnv.endBpOnRegion = endBp;
        data.push(cnv);
      }
    }
    return data;
  }
  private generateAxes(graphContainer, scaleX, scaleY) {
    const xAxisGroup = graphContainer.append('g').attr('class', 'x-axis');
    const yAxisGroup = graphContainer.append('g').attr('class', 'y-axis');

    // generate xAxis
    const xAxis = d3.axisTop(scaleX);
    xAxisGroup.call(xAxis);

    // generate yAxis
    const yAxis = d3.axisLeft(scaleY);
    yAxisGroup.call(yAxis);
  }

  private createTooltip(): d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    any
  > {
    // Prep the tooltip bits, initial display is hidden
    const tooltip = d3
      .select('#chart')
      .append('div')
      .attr('id', 'tooltip')
      .style('position', 'absolute')
      .style('background-color', '#D3D3D3')
      .style('padding', '6px')
      .style('display', 'none')
      .style('z-index', '10');
    return tooltip;
  }

  private createColorScale() {
    const colorScale = d3
      .scaleOrdinal()
      .domain(this.cnvTools.map(tool => tool.cnvToolIdentity))
      .range(d3.schemeCategory10);
    return colorScale;
  }

  private createBars(graphContainer, scaleY, colorScale) {
    // generate bars (add data + color)
    const bars = graphContainer
      .selectAll('g.bar')
      .data(this.cnvTools)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('y', d => scaleY(d.cnvToolIdentity))
      .attr('fill', d => colorScale(d.cnvToolIdentity) as string);

    // generate bar background
    const barBackground = bars
      .insert('rect', ':first-child')
      .attr('height', scaleY.bandwidth)
      .attr('y', d => scaleY(d.cnvToolIdentity))
      .attr('x', '1')
      .attr('width', graphContainer.attr('width'))
      .attr('fill-opacity', '0.5')
      .style('fill', '#F5F5F5')
      .attr('class', 'bar--background');
    return bars;
  }

  private createSubbars(bars, scaleX, scaleY) {
    const subbars = bars
      .selectAll('rect.subbar')
      .data((d: CnvToolAnnotation) => {
        return this.filterDataInRegion(
          this.regionStartBp,
          this.regionEndBp,
          d.cnvToolAnnotations
        );
      })
      .enter()
      .append('rect')
      .attr('class', 'subbar')
      .attr('width', (d: CnvFragmentAnnotation) => {
        return scaleX(d.endBpOnRegion + 1) - scaleX(d.startBpOnRegion);
      })
      .attr('x', d => scaleX(d.startBpOnRegion))
      .attr('height', scaleY.bandwidth)
      .attr('y', function(d) {
        const parentData = d3
          .select(this.parentNode)
          .datum() as CnvToolAnnotation;
        return scaleY(parentData.cnvToolIdentity);
      });
    return subbars;
  }

  private handleClick = (
    d: CnvFragmentAnnotation,
    i,
    n,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  ) => {
    const parentData = d3.select(n[i].parentNode).datum() as CnvToolAnnotation;
    this.createDialog(parentData.cnvToolIdentity, d);
  };
  private handleMouseOver = (i, n) => {
    // change color subbar
    d3.select(n[i])
      .transition()
      .duration(300)
      .attr('fill', '#fff');
  };

  private handleMouseMove = (
    d: CnvFragmentAnnotation,
    tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>
  ) => {
    // tooltip
    const menuHeight = 64;

    tooltip
      .style('left', d3.event.clientX + 20 + 'px')
      .style('top', d3.event.clientY - menuHeight - 20 + 'px')
      .style('display', null);

    tooltip.html(() => {
      let content = `<p>Chromosome ${d.chromosome}: ${d.startBp} - ${d.endBp}</p>`;
      content += ``;
      return content;
    });
  };

  private handleMouseOut = (
    d: CnvFragmentAnnotation,
    i,
    n,
    colorScale,
    tooltip
  ) => {
    console.log('mouseout');

    // subbar
    d3.select(n[i])
      .transition()
      .duration(300)
      .attr('fill', () => {
        const parentData = d3
          .select(n[i].parentNode)
          .datum() as CnvToolAnnotation;
        return colorScale(parentData.cnvToolIdentity);
      });

    // tooltip
    tooltip.style('display', 'none');
  };
  private createChart(): void {
    // create graph (graph consists of xAxis, yAxis, chart)
    const svg = this.createSvg();
    const graphContainer = this.createGraphContainer(svg);
    const [scaleX, scaleY] = this.createScales(graphContainer);
    this.generateAxes(graphContainer, scaleX, scaleY);
    const colorScale = this.createColorScale();

    const bars = this.createBars(graphContainer, scaleY, colorScale);
    const tooltip = this.createTooltip();

    // generate sub bars
    const subbars: d3.Selection<
      SVGSVGElement,
      CnvFragmentAnnotation,
      null,
      undefined
    > = this.createSubbars(bars, scaleX, scaleY);

    // Add Events
    subbars
      .on('mouseover', (d, i, n) => {
        this.handleMouseOver(i, n);
      })
      .on('mouseout', (d, i, n) => {
        this.handleMouseOut(d, i, n, colorScale, tooltip);
      })
      .on('mousemove', (d, i, n) => {
        this.handleMouseMove(d, tooltip);
      })
      .on('click', (d, i, n) => {
        this.handleClick(d, i, n, tooltip);
      });
  }
}
