import { ReformatCnvToolResult } from '../../reformat-cnv-tool-result.model';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';

@Component({
  selector: 'app-reformat-dialog',
  templateUrl: './reformat-dialog.component.html',
  styleUrls: ['./reformat-dialog.component.scss']
})
export class ReformatDialogComponent {
  action: number;
  form: FormGroup;
  dialogTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) { reformatCnvToolResult, action }: any,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ReformatDialogComponent>
  ) {
    this.action = action;
    this.form = this._createForm(reformatCnvToolResult);

    switch (action) {
      case DialogAction.New:
        this.dialogTitle = 'New Data';
        break;

      case DialogAction.Edit:
        this.dialogTitle = 'Edit Data';
        break;
    }
  }

  onSave() {
    this.dialogRef.close(this.form.value);
  }
  private _createForm(reformatCnvToolResult: ReformatCnvToolResult): FormGroup {
    return this._fb.group({
      reformatCnvToolResultId: [reformatCnvToolResult.reformatCnvToolResultId],
      sample: [reformatCnvToolResult.sample],
      chromosome: [reformatCnvToolResult.chromosome],
      cnvType: [reformatCnvToolResult.cnvType],
      startBp: [reformatCnvToolResult.startBp],
      endBp: [reformatCnvToolResult.endBp]
    });
  }
}
