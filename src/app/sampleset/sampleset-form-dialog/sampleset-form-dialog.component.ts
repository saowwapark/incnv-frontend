import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sampleset } from '../sampleset.model';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { Component, OnInit, Inject } from '@angular/core';

import { Action } from './dialog.action.model';

@Component({
  selector: 'sampleset-form-dialog',
  templateUrl: './sampleset-form-dialog.component.html',
  styleUrls: ['./sampleset-form-dialog.component.scss']
})
export class SamplesetFormDialogComponent implements OnInit {
  action: number;
  form: FormGroup;
  dialogTitle: string;

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(
    @Inject(MAT_DIALOG_DATA) { sampleset, action }: any,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SamplesetFormDialogComponent>
  ) {
    this.action = action;
    this.form = this._createSamplesetForm(sampleset);

    switch (action) {
      case Action.New:
        this.dialogTitle = 'New Sample Set';
        break;

      case Action.Edit:
        this.dialogTitle = 'New Sample Set';
        break;
    }
  }

  ngOnInit() {}

  private _createSamplesetForm(sampleset: Sampleset): FormGroup {
    return this._fb.group({
      samplesetId: [sampleset.samplesetId],
      name: [sampleset.name, Validators.required],
      description: [sampleset.description],
      samples: [sampleset.samples]
    });
  }
  onRemoveSample(index: number): void {
    if (index >= 0) {
      const samples = this.form.get('samples').value;
      samples.value.splice(index, 1);
    }
  }

  onAddSample(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const samples = this.form.get('samples').value;
      const splitedValues: string[] = value.split(/[ ,]+/);
      splitedValues.forEach(splitedValue => {
        samples.push(splitedValue.trim());
      });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onSave() {
    this.dialogRef.close(this.form.value);
  }
}