import { DgvAnnotationKey, DgvAnnotation } from './../../../analysis.model';
// onpush
import { AnalysisProcessService } from './../analysis-process.service';

import {
  Component,
  OnInit,
  Input,
  ViewChild,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import {
  trigger,
  state,
  style,
  transition,
  animate
} from '@angular/animations';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

export class FilterObj {
  id: string;
  filterValues: string[];
  constructor(id: string, filterValues: string[]) {
    this.id = id;
    this.filterValues = filterValues;
  }
}

@Component({
  selector: 'app-merged-table',
  templateUrl: './merged-table.component.html',
  styleUrls: ['./merged-table.component.scss'],
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
export class MergedTableComponent implements OnInit, OnChanges, OnDestroy {
  @Input() analysisType: string;
  @Input() cnvInfos: CnvInfo[];
  displayedColumns = [
    'select',
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
  filteredEnsembl = new FilterObj('ensembl', []);
  filteredDgv = new FilterObj('dgv', []);
  filteredClinvarOmimId = new FilterObj('clinvarOmimId', []);
  filteredClinvarPhenotype = new FilterObj('clinvarPhenotype', []);

  // mat-chip
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  dataSource = new MatTableDataSource<CnvInfo>();
  selection = new SelectionModel<CnvInfo>(true, []);
  private _unsubscribeAll: Subject<any>;

  // #########################################  Constructor  #######################################
  constructor(
    public _matDialog: MatDialog,
    private detectorRef: ChangeDetectorRef,
    public service: AnalysisProcessService
  ) {
    this._unsubscribeAll = new Subject();
  }

  // #########################################  Life Cycle Hook #######################################
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.createCustomSort();
    this.dataSource.filterPredicate = this.createCustomFilterFn();

    this.service.onSelectedCnvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((cnvInfos: CnvInfo[]) => {
        this.selection.clear();
        this.selection.select(...cnvInfos);
        this.detectorRef.markForCheck();
      });
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
    console.log('trackby');
    if (!item) {
      return null;
    } else {
      console.log(`${item.startBp} - ${item.endBp}`);
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

  /************************* Select Row **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      // this.updateAllSelectStatus(this.cnvInfos, false);
    } else {
      // this.dataSource.data.forEach(row => this.selection.select(row));
      this.selection.select(...this.dataSource.filteredData);
      // this.updateAllSelectStatus(this.cnvInfos, true);
    }
    this.service.onSelectedCnv.next(this.cnvInfos[0]);
    this.service.onSelectedCnvChanged.next(this.selection.selected);
  }

  toggleRow(checked: boolean, cnvInfo: CnvInfo) {
    this.selection.toggle(cnvInfo);
    cnvInfo.isSelected = checked;

    this.service.onSelectedCnvChanged.next(this.selection.selected);

    // generate interested region
    if (checked) {
      this.service.onSelectedCnv.next(cnvInfo);
    }
  }

  updateAllSelectStatus(list: CnvInfo[], isSelected: boolean) {
    for (let i = 0; i < list.length; i++) {
      list[i].isSelected = isSelected;
    }
  }
  /***************************** Filter Row *******************************/
  applyFilter() {
    const tableFilters = [
      this.filteredEnsembl,
      this.filteredDgv,
      this.filteredClinvarOmimId,
      this.filteredClinvarPhenotype
    ];
    this.dataSource.filter = JSON.stringify(tableFilters);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  createCustomFilterFn() {
    const customeFilterFn = (row: CnvInfo, filtersJson: string) => {
      const filters = JSON.parse(filtersJson) as FilterObj[];
      let isEnsembl = true;
      let isDgv = true;
      let isClinvarOmimId = true;
      let isClinvarPhenotype = true;
      for (const filter of filters) {
        switch (filter.id) {
          case 'ensembl':
            isEnsembl = filter.filterValues.length > 0 ? false : true;
            for (const ensembl of row.ensembls) {
              for (const value of filter.filterValues) {
                if (ensembl.geneSymbol.toLowerCase() === value.toLowerCase()) {
                  isEnsembl = true;
                  break;
                }
              }
              if (isEnsembl === true) {
                break;
              }
            }
            break;
          case 'dgv':
            isDgv = filter.filterValues.length > 0 ? false : true;
            for (const dgv of row.dgvs) {
              // [ 'duplication', 'deletion', 'gain', 'loss', 'gain+loss' ]
              const dgvAnnotations: DgvAnnotation[] = dgv.values;
              for (const dgvAnnotation of dgvAnnotations) {
                for (const searchValue of filter.filterValues) {
                  if (
                    dgvAnnotation.variantAccession.toLowerCase() ===
                    searchValue.toLowerCase()
                  ) {
                    isDgv = true;
                    break;
                  }
                }
                if (isDgv === true) {
                  break;
                }
              }
            }
            break;
          case 'clinvarOmimId':
            isClinvarOmimId = filter.filterValues.length > 0 ? false : true;
            for (const omimId of row.clinvar.omimIds) {
              for (const value of filter.filterValues) {
                if (omimId.toLowerCase() === value.toLowerCase()) {
                  isClinvarOmimId = true;
                  break;
                }
              }
              if (isClinvarOmimId === true) {
                break;
              }
            }
            break;
          case 'clinvarPhenotype':
            isClinvarPhenotype = filter.filterValues.length > 0 ? false : true;
            for (const phenotype of row.clinvar.phenotypes) {
              for (const value of filter.filterValues) {
                if (phenotype.toLowerCase().includes(value.toLowerCase())) {
                  isClinvarPhenotype = true;
                  break;
                }
              }
              if (isClinvarPhenotype) {
                break;
              }
            }
            break;
          default:
            break;
        }
      }

      return isEnsembl && isDgv && isClinvarOmimId && isClinvarPhenotype;
    };
    return customeFilterFn;
  }
  onRemoveFilterValue(index: number, filterValues: string[]): void {
    if (index >= 0) {
      filterValues.splice(index, 1);
      this.applyFilter();
    }
  }

  onClearFilterValues(filterValues: string[]): void {
    filterValues.splice(0, filterValues.length);
    this.applyFilter();
  }
  onAddFilterValue(event: MatChipInputEvent, filterValues: string[]): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const splitedValues: string[] = value.split(/[ ,]+/);
      splitedValues.forEach(splitedValue => {
        filterValues.push(splitedValue.trim());
      });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
