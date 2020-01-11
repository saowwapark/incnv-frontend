import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';
import { CnvFragmentAnnotation } from 'src/app/analysis/analysis.model';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { FormBuilder, NgForm } from '@angular/forms';

@Component({
  selector: 'annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {
  cnv: CnvFragmentAnnotation;
  dialogTitle: string;
  printedEnsembl: string;
  printedDgv: string;
  numberMark;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    { cnvToolIdentity, cnvFragmentAnnotation }: any,
    public dialogRef: MatDialogRef<AnnotationDialogComponent>,
    private fb: FormBuilder
  ) {
    this.dialogTitle = cnvToolIdentity;
    this.cnv = cnvFragmentAnnotation;

    this.numberMark = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: false,
      allowNegative: false
    });
  }

  ngOnInit() {
    this.printedEnsembl = this.createPrintedArray(this.cnv.ensembls);
    this.printedDgv = this.createPrintedArray(this.cnv.dgvs);
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

  selectBasepair(form: NgForm) {
    console.log(form);
    const cloneFragment = { ...this.cnv } as CnvFragmentAnnotation;
    cloneFragment.startBp = form.controls['selectedStartBp'].value;
    cloneFragment.endBp = form.controls['selectedEndBp'].value;
    cloneFragment.dgvs = [];
    cloneFragment.ensembls = [];
    cloneFragment.clinvars = [];
    this.dialogRef.close(cloneFragment);
  }
}
