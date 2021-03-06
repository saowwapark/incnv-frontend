import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { AnalysisProcessService } from '../analysis-process.service';
import {
  CnvInfo,
  MULTIPLE_SAMPLE_ANALYSIS
} from 'src/app/analysis/analysis.model';
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';
import { SelectedCnvDialogComponent } from './selected-cnv-dialog/selected-cnv-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-selected-cnv',
  templateUrl: './selected-cnv.component.html',
  styleUrls: ['./selected-cnv.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class SelectedCnvComponent implements OnInit, OnDestroy {
  @Input() analysisType: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selectedCnvs: CnvInfo[];
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlappingNumbers',
    'cnvTools',
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
  private _unsubscribeAll: Subject<void>;

  constructor(
    public _matDialog: MatDialog,
    private detectorRef: ChangeDetectorRef,
    private service: AnalysisProcessService
  ) {
    // this.detectorRef.detach();
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    if (this.analysisType === MULTIPLE_SAMPLE_ANALYSIS) {
      this.displayedColumns = [
        'no',
        'chromosome',
        'startBp',
        'endBp',
        'cnvType',
        'overlappingNumbers',
        'samples',
        'delete'
      ];
    }
    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cnvInfos: CnvInfo[]) => {
        this.selectedCnvs = cnvInfos;
        this.dataSource.data = this.selectedCnvs;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      });
    this.createCustomSort();
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
  // ################################################ Table ################################################
  ensemblLink(geneId: string) {
    const url = `http://www.ensembl.org/id/${geneId}`;
    window.open(url, '_blank');
  }
  dgvLink(referenceGenome: string, variantAccession: string) {
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

  trackByFn(index: number, item: CnvInfo) {
    if (!item) {
      return null;
    } else {
      return [item.startBp, item.endBp];
    }
  }

  /************************* Sort Row **************************/
  createCustomSort() {
    this.dataSource.sortingDataAccessor = (item: CnvInfo, property) => {
      // property = this.sortBy;
      // console.log('item: '+JSON.stringify(item)+' '+' property: '+ property);
      switch (property) {
        case 'overlappingNumbers': {
          return item.overlaps.length;
        }

        default: {
          return item[property];
        }
      }
    };
    this.dataSource.sort = this.sort;
  }

  exportCnvInfos() {
    this.service.downloadCnvInfos(this.selectedCnvs).subscribe(() => {
      console.log('export success');
    });
  }

  deleteRow(index: number) {
    this.selectedCnvs.splice(index, 1);
    this.service.onSelectedCnvChanged.next(this.selectedCnvs);
    // this.detectorRef.markForCheck();
  }
}
