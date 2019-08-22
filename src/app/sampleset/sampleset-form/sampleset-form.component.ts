import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Sampleset } from './../sampleset.model';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatChipInputEvent
} from '@angular/material';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';

import { Component, OnInit, Inject } from '@angular/core';
@Component({
  selector: 'sampleset-form',
  templateUrl: './sampleset-form.component.html',
  styleUrls: ['./sampleset-form.component.scss']
})
export class SamplesetFormDialogComponent implements OnInit {
  sampleset: Sampleset;
  form: FormGroup;
  dialogTitle: string;
  action: string;

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _fb: FormBuilder,
    public matDialogRef: MatDialogRef<SamplesetFormDialogComponent>
  ) {}

  ngOnInit() {
    this.action = this._data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit Sample Set';
      this.sampleset = this._data.sampleset;
      this.form = this._editSamplesetForm(this.sampleset);
    } else {
      this.dialogTitle = 'New Sample Set';
      this.sampleset = new Sampleset();
      this.form = this._createSamplesetForm();
    }
  }

  private _createSamplesetForm(): FormGroup {
    return this._fb.group({
      name: ['', Validators.required],
      sampleNames: [[]]
    });
  }

  private _editSamplesetForm(sampleset: Sampleset): FormGroup {
    return this._fb.group({
      name: [sampleset.name, Validators.required],
      sampleNames: [sampleset.sampleNames]
    });
  }
  onRemoveSampleName(index: number): void {
    const sampleNames: string[] = this.form.get('sampleNames').value;

    if (index >= 0) {
      sampleNames.splice(index, 1);
    }
  }

  onAddSampleName(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      const sampleNames = this.form.get('sampleNames').value;
      const splitedValues: string[] = value.split(/[ ,]+/);
      splitedValues.forEach(splitedValue => {
        sampleNames.push(splitedValue.trim());
      });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
}
