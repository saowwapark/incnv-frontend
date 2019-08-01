import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { Upload } from '../upload.model';
import { SampleSetService } from 'src/app/sampleset/sampleset.service';
import { UploadsService } from '../uploads.service';
import { SampleSet } from 'src/app/sampleset/sampleset.model';
import { filterIncluded } from '../../../common/map.utils';
import { CustomValidators } from '../../custom.validators';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss'],
  providers: [SampleSetService]
})
export class UploadFormDialogComponent implements OnInit {
  upload: any;
  form: FormGroup;
  dialogTitle: string;
  action: string;
  filePreview: string;

  sampleSets: SampleSet[];
  sampleSetNames: string[] = [];
  sampleSetForm: FormControl;
  tags: string[] = [];

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Auto Complete
  filteredSampleSetNames: Observable<string[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _formBuilder: FormBuilder,
    private _sampleSetService: SampleSetService,
    private _uploadFileService: UploadsService,
    private _router: Router,
    public matDialogRef: MatDialogRef<UploadFormDialogComponent>
  ) {
    this.action = _data.action;

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit CNV Tool';
      this.upload = _data.upload;
    } else {
      this.dialogTitle = 'New CNV Tool';
      this.upload = new Upload({});
    }

    this.form = this._createUploadForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.dialogTitle = 'New CNV Tool';
    this.upload = {
      uploadedFile: '',
      cnvToolName: '',
      sampleSet: '',
      tagList: ''
    };

    this.form = this._createUploadForm();
    this.filteredSampleSetNames = this._createFilteredSampleSet();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createUploadForm(): FormGroup {
    return this._formBuilder.group({
      uploadedFile: [this.upload.uploadedFile, Validators.required],
      cnvToolName: [this.upload.cnvToolName, Validators.required],
      sampleSet: [
        this.upload.sampleSet,
        Validators.required,
        CustomValidators.notHaveInList(this.sampleSetNames)
      ],
      tagList: [this.upload.tagList, Validators.required]
    });
  }

  /** Sample Set */
  private _createFilteredSampleSet() {
    this.sampleSets = this._sampleSetService.getSampleSets();
    this.sampleSetForm = this.form.get('sampleSet') as FormControl;
    this.sampleSetNames = this._uploadFileService.getSampleSetNames();
    // sampleSetForm.value: string
    return this.sampleSetForm.valueChanges.pipe(
      startWith(''),
      map(value => filterIncluded(value, this.sampleSetNames))
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  onAddTag(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  onRemoveTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onNoClick(): void {
    this.matDialogRef.close();
  }

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ uploadedFile: file });
    this.form.get('uploadedFile').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onLoadSampleSetPage() {
    this._router.navigate([]).then(result => {
      window.open('/sampleset', '_blank');
    });
  }
}
