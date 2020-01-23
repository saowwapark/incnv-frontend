import { AnnotationDialogComponent } from '../annotation-dialog/annotation-dialog.component';
import { AnalysisProcessService } from '../analysis-process.service';
import { CnvInfo } from 'src/app/analysis/analysis.model';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { SelectedCnvDialogComponent } from './selected-cnv-dialog/selected-cnv-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
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
  @Input() dataSource: CnvInfo[];
  @Output() updateSelectedCnv = new EventEmitter<CnvInfo[]>();
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlaps',
    'edit',
    'delete'
  ];
  dialogRef: MatDialogRef<AnnotationDialogComponent>;
  expandedElement: string | null;

  constructor(
    public _matDialog: MatDialog,
    private service: AnalysisProcessService
  ) {}

  ngOnInit() {}

  ngOnChanges(): void {
    console.log(this.dataSource);
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
      this.service
        .updateCnvInfo(response)
        .subscribe((updatedCnvInfo: CnvInfo) => {
          this.dataSource[index] = { ...updatedCnvInfo };
          this.dataSource = [...this.dataSource];
          this.updateSelectedCnv.next([...this.dataSource]);
        });
    });
  }

  deleteRow(index: number) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
    this.updateSelectedCnv.next([...this.dataSource]);
  }
}
