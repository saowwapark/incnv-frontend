import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';

import * as igv from 'igv';

@Component({
  selector: 'app-igv',
  templateUrl: './igv.component.html',
  styleUrls: ['./igv.component.scss']
})
export class IgvComponent implements OnInit, AfterViewInit {
  @ViewChild('igvDiv', { static: false })
  igvDiv: ElementRef;
  options;

  constructor() {}

  ngOnInit() {
    this.options = {
      // Example of fully specifying a reference genome.  We could alternatively use  genome: "hg19"
      reference: {
        id: 'hg19',
        fastaURL:
          'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/1kg_v37/human_g1k_v37_decoy.fasta',
        cytobandURL:
          'https://s3.amazonaws.com/igv.broadinstitute.org/genomes/seq/b37/b37_cytoband.txt'
      },
      locus: 'myc',
      tracks: [
        {
          name: 'Genes',
          type: 'annotation',
          format: 'bed',
          url:
            'https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz',
          indexURL:
            'https://s3.amazonaws.com/igv.broadinstitute.org/annotations/hg19/genes/refGene.hg19.bed.gz.tbi',
          order: Number.MAX_VALUE,
          visibilityWindow: 300000000,
          displayMode: 'EXPANDED'
        },
        {
          name: 'Phase 3 WGS variants',
          type: 'variant',
          format: 'vcf',
          url:
            'https://s3.amazonaws.com/1000genomes/release/20130502/ALL.wgs.phase3_shapeit2_mvncall_integrated_v5b.20130502.sites.vcf.gz',
          indexURL:
            'https://s3.amazonaws.com/1000genomes/release/20130502/ALL.wgs.phase3_shapeit2_mvncall_integrated_v5b.20130502.sites.vcf.gz.tbi'
        }
      ]
    };
  }

  ngAfterViewInit(): void {
    console.log(this.igvDiv);
    igv
      .createBrowser(this.igvDiv.nativeElement, this.options)
      .then(function(browser) {
        console.log('Created IGV browser');
      });
  }
}
