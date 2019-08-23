import { TabFileMapping } from '../../../cnvtools/tab-file-mapping/tab-file-mapping.model';
import { ConstantsService } from './../../../constants.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

import { Upload, UploadPost } from '../../upload.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { UploadService } from '../../upload.service';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { filterIncluded } from '../../../common/map.utils';
import { CustomValidators } from '../../../configure-cnv-tools/custom.validators';

@Component({
  selector: 'upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  uploadPost: any;
  form: FormGroup;
  dialogTitle: string;
  action: string;
  filePreview: string;

  tabFileMappings: TabFileMapping[];

  samplesets: Sampleset[];
  samplesetNames: string[] = [];
  samplesetForm: FormControl;

  tags: string[] = [];
  @Output()
  confirmClicked = new EventEmitter<any>();

  private _unsubscribeAll: Subject<any>;

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Auto Complete
  filteredSamplesetNames: Observable<string[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _samplesetService: SamplesetService,
    private _uploadFileService: UploadService,
    private _router: Router,
    private _constant: ConstantsService
  ) {
    this.action = 'new';

    if (this.action === 'edit') {
      this.dialogTitle = 'Edit CNV Tool';
      // this.upload = _data.upload;
    } else {
      this.dialogTitle = 'New CNV Tool';
      this.uploadPost = new UploadPost({});
    }

    this.form = this._createUploadForm();
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    this.dialogTitle = 'New CNV Tool';

    this._samplesetService.onSamplesetsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        this.samplesets = samplesets;
        this.samplesetNames = this.getSamplesetNames();
      });
    this.filteredSamplesetNames = this._createFilteredSampleset();
    this.form = this._createUploadForm();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  getSamplesetNames(): string[] {
    const samplesetNames: string[] = [];
    this.samplesets.forEach(sampleset => {
      samplesetNames.push(sampleset.name);
    });
    return samplesetNames;
  }
  private _createUploadForm(): FormGroup {
    return this._formBuilder.group({
      fileType: [],
      assembly: [],
      fileName: [this.uploadPost.fileName, Validators.required],
      uploadedFile: [this.uploadPost.uploadedFile, Validators.required],
      extraFileInfo: [],
      tabFileMapping: [],
      cnvToolName: [this.uploadPost.cnvToolName, Validators.required],
      sampleset: [
        this.uploadPost.sampleset,
        Validators.required
        // cannot use because error
        // CustomValidators.notHaveInList(this.samplesetNames)
      ],
      tags: [this.uploadPost.tags, Validators.required]
    });
  }

  /** Sample Set */
  private _createFilteredSampleset() {
    this.samplesetForm = this.form.get('sampleset') as FormControl;
    return this.samplesetForm.valueChanges.pipe(
      startWith(''),
      map(value => filterIncluded(value, this.samplesetNames))
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

  onFilePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.controls['fileName'].setValue(file.name);
    this.form.patchValue({ uploadedFile: file });
    this.form.controls['uploadedFile'].updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      // this.filePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onConfirm() {
    this.confirmClicked.emit();
    this.onSaveUpload();
  }
  onSaveUpload() {
    const uploadData = new UploadPost({
      userId: this._constant.userId,
      fileName: this.form.get('fileName').value,
      cnvToolName: this.form.get('cnvToolName').value,
      samplesetId: this.form.get('sampleset').value,
      tags: this.tags
    });

    const file = this.form.controls['uploadedFile'].value as File;

    this._uploadFileService.addUpload(uploadData, file);
  }

  onReset() {
    this.form.reset();
  }
  onLoadSamplesetPage() {
    this._router.navigate([]).then(result => {
      window.open('/sampleset', '_blank');
    });
  }
}
