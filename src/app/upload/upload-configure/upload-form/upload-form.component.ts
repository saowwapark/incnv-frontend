import { UploadFormService } from './upload-form.service';
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
import { MatChipInputEvent } from '@angular/material/chips';

import { UploadPost } from '../../upload.model';
import { UploadService } from '../../upload.service';
import { filterIncluded } from '../../../common/map.utils';
import { CustomValidators } from '../../../configure-cnv-tools/custom.validators';
import { IdAndName } from 'src/app/types/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  uploadPost: any;
  form: FormGroup;
  filePreview: string;

  tabFileMappings$: Observable<IdAndName[]>;
  tabFileMappings: IdAndName[];

  samplesets$: Observable<IdAndName[]>;
  samplesets: IdAndName[];

  tags: string[] = [];
  @Output()
  confirmClicked = new EventEmitter<any>();

  private _unsubscribeAll: Subject<any>;

  // Tag
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  // Auto Complete
  filteredSamplesets$: Observable<IdAndName[]>;
  filteredTabFileMappings$: Observable<IdAndName[]>;

  constructor(
    private _formBuilder: FormBuilder,
    private _uploadFileService: UploadService,
    private _uploadFormService: UploadFormService,
    private _router: Router,
    private route: ActivatedRoute,
    private _constant: ConstantsService
  ) {
    this.form = this._createUploadForm();
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit() {
    console.log('upload-form.component.ts');
    this.form = this._createUploadForm();
    const uploadForm$ = this.route.snapshot.data['uploadForm'];

    this.samplesets$ = uploadForm$.pipe(map(data => data[0]));
    this.samplesets$.subscribe(sampleset => {
      this.samplesets = sampleset;
    });

    this.tabFileMappings$ = uploadForm$.pipe(map(data => data[1]));
    this.tabFileMappings$.subscribe(tabFileMappings => {
      this.tabFileMappings = tabFileMappings;
    });

    // this._uploadFormService.onSamplesetsChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(logMessage => {
    //     this.samplesets$ = this._uploadFormService.getSamplesets();
    //     this.samplesets$.subscribe(sampleset => {
    //       this.samplesets = sampleset;
    //     });
    //   });

    // this._uploadFormService.onTapFileMappingChanged
    //   .pipe(takeUntil(this._unsubscribeAll))
    //   .subscribe(logMessage => {
    //     this.tabFileMappings$ = this._uploadFormService.getTapFileMappings();
    //     this.tabFileMappings$.subscribe(tabFileMappings => {
    //       this.tabFileMappings = tabFileMappings;
    //     });
    //   });

    this.filteredSamplesets$ = this.form.get('sampleset').valueChanges.pipe(
      startWith(''),
      map(value => filterIncluded(value, this.samplesets))
    );
    this.filteredTabFileMappings$ = this.form
      .get('tabFileMapping')
      .valueChanges.pipe(
        startWith(''),
        map(value => filterIncluded(value, this.tabFileMappings))
      );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  private _createUploadForm(): FormGroup {
    this.uploadPost = new UploadPost({});
    return this._formBuilder.group({
      fileType: [],
      assembly: [],
      fileName: [this.uploadPost.fileName, Validators.required],
      uploadedFile: [this.uploadPost.uploadedFile, Validators.required],
      extraFileInfo: [],
      tabFileMapping: [],
      cnvToolName: [null, Validators.required],
      sampleset: [
        null,
        Validators.required
        // cannot use because error
        // CustomValidators.notHaveInList(this.samplesetNames)
      ],
      tags: [null, Validators.required]
    });
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
      userId: 1,
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

  onLoadTabFileMappingPage() {
    this._router.navigate([]).then(result => {
      window.open('/tabfilemapping', '_blank');
    });
  }
}
