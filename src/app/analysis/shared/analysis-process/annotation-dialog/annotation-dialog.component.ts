import {
  RegionBp,
  CnvInfo,
  MERGED_RESULT_NAME,
  SELECTED_CNV_ID
} from '../../../analysis.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef
} from '@angular/core';

import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import {
  FormBuilder,
  NgForm,
  FormGroup,
  Validators,
  ValidatorFn,
  FormControl
} from '@angular/forms';

@Component({
  selector: 'annotation-dialog',
  templateUrl: './annotation-dialog.component.html',
  styleUrls: ['./annotation-dialog.component.scss']
})
export class AnnotationDialogComponent implements OnInit {
  cnvInfo: CnvInfo;
  dialogTitle: string;
  selectedCnvRegions?: RegionBp[];
  numberMark;
  isSelectable: boolean;
  selectForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    { title, cnvInfo, selectedCnvRegions }: any,
    public dialogRef: MatDialogRef<AnnotationDialogComponent>,
    public matDialogRef: MatDialogRef<AnnotationDialogComponent>,
    private fb: FormBuilder
  ) {
    this.dialogTitle = title;
    this.cnvInfo = cnvInfo;
    this.selectedCnvRegions = selectedCnvRegions;
    this.numberMark = createNumberMask({
      prefix: '',
      suffix: '',
      includeThousandsSeparator: true,
      thousandsSeparatorSymbol: ',',
      allowDecimal: false,
      allowNegative: false
    });

    if (title === MERGED_RESULT_NAME || title === SELECTED_CNV_ID) {
      this.isSelectable = true;
    } else {
      this.isSelectable = false;
    }
    this.selectForm = this.createSelectForm();
  }

  ngOnInit() {
    this.matDialogRef.addPanelClass('annotation-dialog');
  }

  // createSelectForm() {
  //   const selectForm = this.fb.group({
  //     selectedStartBp: [
  //       '',
  //       [
  //         Validators.min(this.cnvInfo.startBp),
  //         Validators.max(this.cnvInfo.endBp)
  //       ]
  //     ],
  //     selectedEndBp: [
  //       '',
  //       [
  //         Validators.min(this.cnvInfo.startBp),
  //         Validators.max(this.cnvInfo.endBp)
  //       ]
  //     ]
  //   });
  //   if (this.selectedCnvRegions && this.selectedCnvRegions.length > 0) {
  //     selectForm.setValidators([
  //       this.duplicationValidator(this.selectedCnvRegions)
  //     ]);
  //     selectForm.updateValueAndValidity();
  //   }
  //   return selectForm;
  // }

  createSelectForm() {
    const selectForm = this.fb.group({
      selectedStartBp: [
        '',
        [
          Validators.min(this.cnvInfo.startBp),
          Validators.max(this.cnvInfo.endBp)
        ]
      ],
      selectedEndBp: [
        '',
        [
          Validators.min(this.cnvInfo.startBp),
          Validators.max(this.cnvInfo.endBp)
        ]
      ]
    });
    // if (this.selectedCnvRegions && this.selectedCnvRegions.length > 0) {
    //   selectForm.setValidators([
    //     this.duplicationValidator(this.selectedCnvRegions)
    //   ]);
    //   selectForm.updateValueAndValidity();
    // }
    return selectForm;
  }

  duplicationValidator = (regionBps: RegionBp[]): ValidatorFn => {
    return (g: FormGroup) => {
      for (const regionBp of regionBps) {
        const unmaskNumericPattern = /\D/g;

        const selectedStartBp = g.controls['selectedStartBp'].value.replace(
          unmaskNumericPattern,
          ''
        );
        const selectedEndBp = g.controls['selectedEndBp'].value.replace(
          unmaskNumericPattern,
          ''
        );
        if (
          selectedStartBp === regionBp.startBp &&
          selectedEndBp === regionBp.endBp
        ) {
          return {
            duplicated: { valid: false }
          };
        }
      }
    };
  };

  selectBasepair() {
    const clonedCnvInfo = { ...this.cnvInfo } as CnvInfo;
    clonedCnvInfo.startBp = this.selectForm.controls['selectedStartBp'].value;
    clonedCnvInfo.endBp = this.selectForm.controls['selectedEndBp'].value;
    clonedCnvInfo.dgvs = [];
    clonedCnvInfo.ensembls = [];
    clonedCnvInfo.clinvar = {};
    this.dialogRef.close(clonedCnvInfo);
  }

  getErrorMessage() {
    return this.selectForm.hasError('required')
      ? 'You must enter a value'
      : this.selectForm.hasError('duplicated')
      ? 'Duplicated'
      : '';
  }

  copyPasteStartBp() {
    this.selectForm.controls['selectedStartBp'].setValue(this.cnvInfo.startBp);
  }

  copyPasteEndBp() {
    this.selectForm.controls['selectedEndBp'].setValue(this.cnvInfo.endBp);
  }

  ensemblLink(geneId) {
    const url = `http://www.ensembl.org/id/${geneId}`;
    window.open(url, '_blank');
  }
  dgvLink(variantAccession) {
    if (this.cnvInfo.referenceGenome === 'grch37') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg19/?name=${variantAccession}`;
      window.open(url, '_blank');
    } else {
      window.location.href = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg38/?name=${variantAccession}`;
    }
  }
}
