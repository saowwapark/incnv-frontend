import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Component, OnInit, Inject } from '@angular/core';
import { CnvFragmentAnnotation } from 'src/app/analysis/analysis.model';

@Component({
  selector: 'annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {
  fragment: CnvFragmentAnnotation;
  dialogTitle: string;
  printedEnsembl: string;
  printedDgv: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    { cnvToolIdentity, cnvFragmentAnnotation }: any,
    public dialogRef: MatDialogRef<AnnotationDialogComponent>
  ) {
    this.dialogTitle = cnvToolIdentity;
    this.fragment = cnvFragmentAnnotation;
  }

  ngOnInit() {
    this.printedEnsembl = this.createPrintedArray(this.fragment.ensembl);
    this.printedDgv = this.createPrintedArray(this.fragment.dgv);
  }

  private createPrintedArray(arrData: any[]) {
    let output: string;
    arrData.forEach((data, index) => {
      if (index === 0) {
        output = data;
      } else {
        output += ` ${data}`;
      }
    });
    return output;
  }
}
