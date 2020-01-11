import { CnvFragmentAnnotation } from 'src/app/analysis/analysis.model';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';
import { SelectedCnvDialogComponent } from './selected-cnv-dialog/selected-cnv-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { Sampleset } from 'src/app/sampleset/sampleset.model';

@Component({
  selector: 'app-selected-cnv',
  templateUrl: './selected-cnv.component.html',
  styleUrls: ['./selected-cnv.component.scss']
})
export class SelectedCnvComponent implements OnInit, OnChanges {
  // @Input() selectedCnvs: CnvFragmentAnnotation[];
  // dataSource;
  @Input() dataSource: CnvFragmentAnnotation[];
  @Output() updateSelectedCnv = new EventEmitter<CnvFragmentAnnotation[]>();
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlapTools',
    'edit',
    'delete'
  ];
  dialogRef: MatDialogRef<SelectedCnvDialogComponent>;

  constructor(public _matDialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(): void {
    console.log(this.dataSource);
  }

  editRow(generalInfo: CnvFragmentAnnotation, index: number): void {
    // Original data
    this.dialogRef = this._matDialog.open(SelectedCnvDialogComponent, {
      panelClass: 'dialog-default',
      data: {
        cnvFragmentAnnotation: generalInfo
      }
    });

    // Updated data
    this.dialogRef.afterClosed().subscribe(response => {
      if (!response) {
        return;
      }
      this.dataSource[index] = response;
      this.dataSource = [...this.dataSource];

      this.updateSelectedCnv.next(this.dataSource);
    });
  }

  deleteRow(index: number) {
    this.dataSource.splice(index, 1);
    this.dataSource = [...this.dataSource];
    this.updateSelectedCnv.next(this.dataSource);
  }

  addRow() {}
}
