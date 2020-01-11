import { NgForm } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import { CnvFragmentAnnotation } from 'src/app/analysis/analysis.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-selected-cnv-dialog',
  templateUrl: './selected-cnv-dialog.component.html',
  styleUrls: ['./selected-cnv-dialog.component.scss']
})
export class SelectedCnvDialogComponent implements OnInit {
  cnv: CnvFragmentAnnotation;
  dialogTitle: string;

  numberMark;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    { cnvFragmentAnnotation }: any,
    public dialogRef: MatDialogRef<SelectedCnvDialogComponent>
  ) {
    this.dialogTitle = 'Selected CNV';
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

  ngOnInit() {}

  selectBasepair(form: NgForm) {
    const cloneFragment = { ...this.cnv } as CnvFragmentAnnotation;
    cloneFragment.startBp = form.controls['selectedStartBp'].value;
    cloneFragment.endBp = form.controls['selectedEndBp'].value;

    this.dialogRef.close(cloneFragment);
  }
}
