import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
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
    this.printedEnsembl = this.createPrintedArray(this.fragment.ensembls);
    this.printedDgv = this.createPrintedArray(this.fragment.dgvs);
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
  selectBasepair(selectedStartBp, selectedEndBp) {
    const cloneFragment = { ...this.fragment } as CnvFragmentAnnotation;
    cloneFragment.startBp = selectedStartBp;
    cloneFragment.endBp = selectedEndBp;
    cloneFragment.dgvs = [];
    cloneFragment.ensembls = [];
    cloneFragment.clinvars = [];
    this.dialogRef.close(cloneFragment);
  }
}
