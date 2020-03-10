import { map, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MultipleConfigureService } from 'src/app/analysis/multiple-configure/multiple-configure.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-choose-many-sample',
  templateUrl: './choose-many-sample.component.html',
  styleUrls: ['./choose-many-sample.component.scss']
})
export class ChooseManySampleComponent implements OnInit, OnChanges, OnDestroy {
  @Input() samples: string[];

  @ViewChild('selectAllCheckbox', { static: true })
  selectAllCheckbox: ElementRef;
  parentForm: FormGroup;

  // private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private fb: FormBuilder,
    private service: MultipleConfigureService
  ) {
    this._unsubscribeAll = new Subject();

    this.parentForm = this.fb.group({
      sampleFormArray: this.fb.array([this.newSample(), this.newSample()])
    });
  }

  get sampleFormArray(): FormArray {
    return this.parentForm.get('sampleFormArray') as FormArray;
  }

  newSample(value?: string): FormGroup {
    if (value) {
      return this.fb.group({
        sample: [value]
      });
    } else {
      return this.fb.group({
        sample: ['']
      });
    }
  }
  addNewSample(i: number) {
    this.sampleFormArray.controls.splice(i + 1, 0, this.newSample());
  }
  removeSample(i: number) {
    if (this.sampleFormArray.length > 2) {
      this.sampleFormArray.removeAt(i);
    }
    this.onSubmit();
  }
  clearFormArray = (formArray: FormArray) => {
    formArray = this.fb.array([]);
  };
  onSubmit() {
    // this.sampleFormArray.at(i).patchValue({ sample: sample });
    const samples = [];
    const length = this.sampleFormArray.length;
    for (let i = 0; i < length; i++) {
      const item = this.sampleFormArray.at(i);
      const value = item.get('sample').value;
      samples.push(value);
    }
    // const array = this.sampleFormArray.value;
    // const data = array.map(d => d.sample);
    this.service.onSelectedSamplesChange.next(samples);
  }
  ngOnInit() {
    this.service.onSelectedSamplesChange
      .pipe(distinctUntilChanged(), takeUntil(this._unsubscribeAll))
      .subscribe(selectedSamples => {
        if (!selectedSamples || selectedSamples.length === 0) {
          // clear value
          this.resetSampleFormArray();
        } else {
          this.sampleFormArray.clear();
          for (let i = 0; i < selectedSamples.length; i++) {
            const selectedSample = selectedSamples[i];
            this.sampleFormArray.push(this.newSample(selectedSample));
          }
        }
      });
  }
  ngOnChanges(changes: SimpleChanges): void {}

  resetSampleFormArray() {
    this.sampleFormArray.clear();
    this.sampleFormArray.push(this.newSample());
    this.sampleFormArray.push(this.newSample());
  }

  addAllSamples() {
    for (const sample of this.samples) {
      this.sampleFormArray.push(this.newSample(sample));
    }
  }
  toggleSelectAll(checked: boolean) {
    if (checked) {
      this.addAllSamples();
      this.service.onSelectedSamplesChange.next(this.samples);
    } else {
      this.resetSampleFormArray();
      this.service.onSelectedSamplesChange.next([]);
    }
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
