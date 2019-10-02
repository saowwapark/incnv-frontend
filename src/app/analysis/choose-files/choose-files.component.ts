import { UploadService } from '../../upload/upload.service';
import { Sampleset } from './../../sampleset/sampleset.model';

import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { SelectionModel, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { mapIdToName } from 'src/app/common/map.utils';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  takeUntil,
  map,
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject, merge, fromEvent } from 'rxjs';
import { SearchUtils } from 'src/app/common/search.utils';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'choose-files',
  templateUrl: './choose-files.component.html',
  styleUrls: ['./choose-files.component.scss']
})
export class ChooseFilesComponent implements OnInit, OnDestroy {
  samplesets: Sampleset[];
  chosenSampleset: FormControl;

  // Private

  private _unsubscribeAll: Subject<any>;

  constructor(
    private _samplesetService: SamplesetService,
    private _uploadService: UploadService
  ) {
    // Set the defaults
    this.chosenSampleset = new FormControl('');
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    this._samplesetService.onSamplesetsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(samplesets => {
        this.samplesets = samplesets;
      });

    this.chosenSampleset.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchSamplesetId => {
        this._uploadService.onSearchSamplesetIdChanged.next(searchSamplesetId);
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
