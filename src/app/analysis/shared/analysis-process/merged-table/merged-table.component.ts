import { Component, OnInit, Input, ViewChild, OnChanges } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import {
  MatDialogRef,
  MatTableDataSource,
  MatDialog,
  MatSort,
  MatPaginator
} from '@angular/material';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';

@Component({
  selector: 'app-merged-table',
  templateUrl: './merged-table.component.html',
  styleUrls: ['./merged-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
  ]
})
export class MergedTableComponent implements OnInit, OnChanges {
  @Input() analysisType: string;
  @Input() cnvInfos: CnvInfo[];

  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlappingNumbers',
    'cnvTools'
  ];
  dialogRef: MatDialogRef<AnnotationDialogComponent>;
  expandedElement: string | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource = new MatTableDataSource<CnvInfo>();

  constructor(public _matDialog: MatDialog) {}

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.cnvInfos;
    if (this.analysisType === 'multipleSamples') {
      this.displayedColumns = [
        'no',
        'chromosome',
        'startBp',
        'endBp',
        'cnvType',
        'overlappingNumbers',
        'samples'
      ];
    }
  }
  ensemblLink(geneId) {
    const url = `http://www.ensembl.org/id/${geneId}`;
    window.open(url, '_blank');
  }
  dgvLink(referenceGenome, variantAccession) {
    if (referenceGenome === 'grch37') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg19/?name=${variantAccession}`;
      window.open(url, '_blank');
    } else if (referenceGenome === 'grch38') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg38/?name=${variantAccession}`;
      window.open(url, '_blank');
    }
  }
  clinvarLink(omimId: string) {
    const url = `https://omim.org/search/?search=${omimId}`;
    window.open(url, '_blank');
  }
}
