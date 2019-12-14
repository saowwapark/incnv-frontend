import { ReformatCnvToolResult } from './../upload-reformat.model';
import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogAction } from 'src/app/shared/models/dialog.action.model';

@Component({
  selector: 'app-upload-reformat-dialog',
  templateUrl: './upload-reformat-dialog.component.html',
  styleUrls: ['./upload-reformat-dialog.component.scss']
})
export class UploadReformatDialogComponent implements OnInit {
  action: number;
  form: FormGroup;
  dialogTitle: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) { reformatCnvToolResult, action }: any,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<UploadReformatDialogComponent>
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

  ngOnInit() {}

  private _createForm(reformatCnvToolResult: ReformatCnvToolResult): FormGroup {
    return this._fb.group({
      reformatCnvToolResultId: [reformatCnvToolResult.reformatCnvToolResultId],
      chromosome: [reformatCnvToolResult.chromosome],
      cnvType: [reformatCnvToolResult.cnvType],
      startBasepair: [reformatCnvToolResult.startBasepair],
      endBasepair: [reformatCnvToolResult.endBasepair]
    });
  }

  onSave() {
    this.dialogRef.close(this.form.value);
  }
}
