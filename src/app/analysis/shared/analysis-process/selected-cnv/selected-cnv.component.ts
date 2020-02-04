import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { AnalysisProcessService } from '../analysis-process.service';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core';
import { SelectedCnvDialogComponent } from './selected-cnv-dialog/selected-cnv-dialog.component';
import {
  MatDialogRef,
  MatDialog,
  MatSort,
  MatTableDataSource
} from '@angular/material';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';

@Component({
  selector: 'app-selected-cnv',
  templateUrl: './selected-cnv.component.html',
  styleUrls: ['./selected-cnv.component.scss'],
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
export class SelectedCnvComponent implements OnInit, OnChanges {
  @Input() analysisType: string;
  @Input() selectedCnvs: CnvInfo[];
  @Output() updateSelectedCnv = new EventEmitter<CnvInfo[]>();
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlappingNumbers',
    'cnvTools',
    'edit',
    'delete'
  ];
  dialogRef: MatDialogRef<AnnotationDialogComponent>;
  expandedElement: string | null;

  // matSort: MatSort;
  // @ViewChild(MatSort, { static: false }) set content(content: MatSort) {
  //   console.log(content);
  //   this.matSort = content;
  // }

  dataSource = new MatTableDataSource<CnvInfo>();

  constructor(
    public _matDialog: MatDialog,
    private service: AnalysisProcessService
  ) {}

  ngOnInit() {
    if (this.analysisType === 'multipleSamples') {
      this.displayedColumns = [
        'no',
        'chromosome',
        'startBp',
        'endBp',
        'cnvType',
        'overlappingNumbers',
        'samples',
        'edit',
        'delete'
      ];
    }
  }

  ngOnChanges(): void {
    this.dataSource.data = this.selectedCnvs;
  }

  editRow(cnvInfo: CnvInfo, index: number): void {
    // Original data
    this.dialogRef = this._matDialog.open(AnnotationDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        title: 'selected CNV',
        cnvInfo: cnvInfo
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      // new selected startBp and endBp
      this.service.getCnvInfo(response).subscribe((updatedCnvInfo: CnvInfo) => {
        this.selectedCnvs[index] = { ...updatedCnvInfo };
        this.updateSelectedCnv.next([...this.selectedCnvs]);
      });
    });
  }

  deleteRow(index: number) {
    this.selectedCnvs.splice(index, 1);
    this.updateSelectedCnv.next([...this.selectedCnvs]);
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
