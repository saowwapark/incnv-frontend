import { RegionBp, CnvInfo, MERGED_RESULT_NAME } from '../../../analysis.model';
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
    { title, cnvInfo }: any,
    public matDialogRef: MatDialogRef<AnnotationDialogComponent>
  ) {
    this.dialogTitle = title;
    this.cnvInfo = cnvInfo;

    if (title === MERGED_RESULT_NAME) {
      this.isSelectable = true;
    } else {
      this.isSelectable = false;
    }
  }

  ngOnInit() {
    this.matDialogRef.addPanelClass('annotation-dialog');
  }

  selectCnv(checked: boolean) {
    if (checked === true) {
      this.cnvInfo.isSelected = true;
    } else {
      this.cnvInfo.isSelected = false;
    }
    this.matDialogRef.close(this.cnvInfo);
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

  ensemblLink(geneId: string) {
    const url = `http://www.ensembl.org/id/${geneId}`;
    window.open(url, '_blank');
  }
  dgvLink(variantAccession: string) {
    if (this.cnvInfo.referenceGenome === 'grch37') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg19/?name=${variantAccession}`;
      window.open(url, '_blank');
    } else if (this.cnvInfo.referenceGenome === 'grch38') {
      const url = `http://dgv.tcag.ca/gb2/gbrowse/dgv2_hg38/?name=${variantAccession}`;
      window.open(url, '_blank');
    }
  }
  clinvarLink(omimId: string) {
    const url = `https://omim.org/search/?search=${omimId}`;
    window.open(url, '_blank');
  }
}
