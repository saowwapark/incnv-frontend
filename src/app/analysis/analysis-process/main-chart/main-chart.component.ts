import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  Input,
  HostListener
} from '@angular/core';
import * as d3 from 'd3';
import { CnvToolAnnotation, CnvFragmentAnnotation } from '../../analysis.model';
import { AnnotationDialogComponent } from './annotation-dialog/annotation-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.scss']
})
export class MainChartComponent implements OnInit, OnChanges {
  @Input() cnvTools: CnvToolAnnotation[];
  @Input() height: number;
  @Input() regionStartBp: number;
  @Input() regionEndBp: number;
  @ViewChild('mainChart', { static: true })
  private chartContainer: ElementRef;

  dialogRef: MatDialogRef<AnnotationDialogComponent>;

  chartWidth: number;
  mergedToolIdentity = 'merged tools';
  svg: d3.Selection<SVGSVGElement, CnvToolAnnotation, null, undefined>;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.chartWidth = event.target.innerWidth;
    this.updateChart();
  }

  constructor(private _matDialog: MatDialog) {}
  ngOnChanges(): void {
    if (!this.cnvTools) {
      return;
    }
    this.updateChart();
    // this.createChart();
  }
  ngOnInit() {}

  private createChart(): void {
    // create graph (graph consists of xAxis, yAxis, chart)
    this.svg = this.createSvg();
    const containerMargin = this.calContainerMargin();
    const graphContainer = this.createGraphContainer(this.svg, containerMargin);

    const [scaleX, scaleY] = this.createScaleXY(graphContainer);
    this.generateAxes(graphContainer, scaleX, scaleY);
    const colorScale = this.createColorScale();
    const mergedColorScale = this.createLinearColorScale(
      colorScale(this.mergedToolIdentity)
    );

    const bars = this.createBars(graphContainer, scaleY);
    const tooltip = this.createTooltip();

    // generate sub bars
    const subbars: d3.Selection<
      SVGSVGElement,
      CnvFragmentAnnotation,
      null,
      undefined
    > = this.createSubbars(bars, scaleX, scaleY, colorScale, mergedColorScale);

    // Add Events
    subbars
      .on('mouseover', (d, i, n) => {
        this.handleMouseOver(i, n);
      })
      .on('mouseout', (d, i, n) => {
        this.handleMouseOut(d, i, n, colorScale, mergedColorScale, tooltip);
      })
      .on('mousemove', (d, i, n) => {
        this.handleMouseMove(d, tooltip);
      })
      .on('click', (d, i, n) => {
        this.handleClick(d, i, n, tooltip);
      });
  }

  /**
   *  Sub Functions
   */
  private updateChart() {
    if (this.svg) {
      this.svg.remove();
    }

    this.createChart();
  }
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
      .attr('class', 'main-graph-container')
      .attr('width', contentWidth)
      .attr('height', contentHeight)
      .attr(
        'transform',
        `translate(${containerMargin.left}, ${containerMargin.top})`
      );
    return d3.select('.main-graph-container');
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
      .attr('height', this.height);
    return svg;
  }

  private createLinearColorScale(maxColor) {
    const myColor = d3
      .scaleLinear<string>()
      .domain([-2, this.cnvTools.length - 1])
      .range(['white', maxColor]);
    return myColor;
  }
  private createScaleXY(
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
      .paddingInner(0.3)
      .paddingOuter(0.2);

    return [scaleX, scaleY];
  }

  private chooseBasepair(
    cnv: CnvFragmentAnnotation,
    regionStartBp,
    regionEndBp
  ) {
    let chosenStartBp: number;
    let chosenEndBp: number;

    const diffStart = cnv.startBp - regionStartBp;
    const diffEnd = cnv.endBp - regionEndBp;
    const diffEndStart = cnv.endBp - regionStartBp;
    const diffStartEnd = cnv.startBp - regionEndBp;
    // choose cnv in region
    // left region
    if (diffEndStart > 0 && diffStart <= 0) {
      chosenStartBp = regionStartBp;
      chosenEndBp = cnv.endBp;
    } else if (
      (diffEndStart === 0 && diffStart < 0) ||
      (cnv.startBp === cnv.endBp && cnv.startBp === regionStartBp)
    ) {
      chosenStartBp = regionStartBp;
      chosenEndBp = regionStartBp;
    }
    // right region
    else if (diffEnd >= 0 && diffStartEnd < 0) {
      chosenStartBp = cnv.startBp;
      chosenEndBp = regionEndBp;
    } else if (
      diffStartEnd === 0 &&
      diffEnd > 0 &&
      cnv.startBp === cnv.endBp &&
      cnv.startBp === regionEndBp
    ) {
      chosenStartBp = regionEndBp;
      chosenEndBp = regionEndBp;
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
      chosenStartBp = regionStartBp;
      chosenEndBp = regionEndBp;
    }
    return { chosenStartBp: chosenStartBp, chosenEndBp: chosenEndBp };
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
        const { chosenStartBp, chosenEndBp } = this.chooseBasepair(
          cnv,
          regionStartBp,
          regionEndBp
        );
        cnv.startBpOnRegion = chosenStartBp;
        cnv.endBpOnRegion = chosenEndBp;
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
    // .tickFormat(d3.format('.4s'));
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
    const element = this.chartContainer.nativeElement;

    const tooltip = d3
      .select(element)
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

  private createBars(graphContainer, scaleY) {
    // generate bars (add data + color)
    const bars = graphContainer
      .selectAll('g.bar')
      .data(this.cnvTools)
      .enter()
      .append('g')
      .attr('class', 'bar')
      .attr('y', d => scaleY(d.cnvToolIdentity));

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

  private createSubbars(bars, scaleX, scaleY, colorScale, mergedColorScale) {
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
        return scaleX(d.endBpOnRegion) - scaleX(d.startBpOnRegion) + 1;
      })
      .attr('x', d => scaleX(d.startBpOnRegion))
      .attr('height', scaleY.bandwidth)
      .attr('y', function(d) {
        const parentData = d3
          .select(this.parentNode)
          .datum() as CnvToolAnnotation;
        return scaleY(parentData.cnvToolIdentity);
      })
      .attr('fill', (d: CnvFragmentAnnotation, i, n) => {
        const parentData: CnvToolAnnotation = d3
          .select(n[i].parentNode)
          .datum() as CnvToolAnnotation;
        const cnvToolIdentity = parentData.cnvToolIdentity;
        let color = colorScale(cnvToolIdentity) as string;
        if (cnvToolIdentity === 'merged tools') {
          color = mergedColorScale(d.overlapTools.length);
        }

        return color;
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
    console.log('mousemove');

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
    mergedColorScale,
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
        const cnvToolIdentity = parentData.cnvToolIdentity;
        let color = colorScale(parentData.cnvToolIdentity);
        if (cnvToolIdentity === this.mergedToolIdentity) {
          color = mergedColorScale(d.overlapTools.length);
        }
        return color;
      });

    // tooltip
    tooltip.style('display', 'none');
  };
}
