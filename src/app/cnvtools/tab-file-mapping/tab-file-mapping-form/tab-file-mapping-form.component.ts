import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TabFileMappingConfigured } from '../tab-file-mapping.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'tab-file-mapping-form',
  templateUrl: './tab-file-mapping-form.component.html',
  styleUrls: ['./tab-file-mapping-form.component.scss']
})
export class TabFileMappingFormDialogComponent implements OnInit {
  fileMappingConfigured: TabFileMappingConfigured;
  form: FormGroup;
  dialogTitle: string;
  action: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _fb: FormBuilder,
    public matDialogRef: MatDialogRef<TabFileMappingFormDialogComponent>
  ) {}

  ngOnInit() {
    this.action = this._data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit CNV Tool';
      this.fileMappingConfigured = this._data.fileMappingConfigured;
    } else {
      this.dialogTitle = 'New CNV Tool';
      this.fileMappingConfigured = new TabFileMappingConfigured();
    }
    this.form = this._createTabFileMappingConfiguredForm();
  }

  private _createTabFileMappingConfiguredForm(): FormGroup {
    return this._fb.group({
      cnvToolName: [
        this.fileMappingConfigured.cnvToolName,
        Validators.required
      ],
      headerField: this._fb.group({
        sampleName: [
          this.fileMappingConfigured.headerField.sampleName,
          Validators.required
        ],
        chr: [this.fileMappingConfigured.headerField.chr, Validators.required],
        startBp: [
          this.fileMappingConfigured.headerField.startBp,
          Validators.required
        ],
        endBp: [
          this.fileMappingConfigured.headerField.endBp,
          Validators.required
        ],
        cnvType: [
          this.fileMappingConfigured.headerField.cnvType,
          Validators.required
        ]
      }),
      dataField: this._fb.group({
        chr22: [
          this.fileMappingConfigured.dataField.chr22,
          Validators.required
        ],
        dup: [this.fileMappingConfigured.dataField.dup, Validators.required],
        del: [this.fileMappingConfigured.dataField.del, Validators.required]
      })
    });
  }

  private _editTabFileMappingConfiguredForm(
    fileMappingConfigured: TabFileMappingConfigured
  ): FormGroup {
    return this._fb.group({
      cnvToolName: [fileMappingConfigured.cnvToolName, Validators.required],
      headerField: this._fb.group({
        sampleName: [
          fileMappingConfigured.headerField.sampleName,
          Validators.required
        ],
        chr: [fileMappingConfigured.headerField.chr, Validators.required],
        startBp: [
          fileMappingConfigured.headerField.startBp,
          Validators.required
        ],
        endBp: [fileMappingConfigured.headerField.endBp, Validators.required],
        cnvType: [
          fileMappingConfigured.headerField.cnvType,
          Validators.required
        ]
      }),
      dataField: this._fb.group({
        chr22: [fileMappingConfigured.dataField.chr22, Validators.required],
        dup: [fileMappingConfigured.dataField.dup, Validators.required],
        del: [fileMappingConfigured.dataField.del, Validators.required]
      })
    });
  }
}
