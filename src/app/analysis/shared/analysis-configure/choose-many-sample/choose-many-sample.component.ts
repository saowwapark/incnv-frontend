import { map } from 'rxjs/operators';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormArray,
  FormControl,
  Validator,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-choose-many-sample',
  templateUrl: './choose-many-sample.component.html',
  styleUrls: ['./choose-many-sample.component.scss']
})
export class ChooseManySampleComponent implements OnInit, OnChanges {
  @Input() samples: string[];
  @Input() selectedSamples: string;
  @Output() selectedSamplesChange = new EventEmitter<string[]>();

  parentForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
  addSamples(i: number) {
    this.sampleFormArray.controls.splice(i + 1, 0, this.newSample());
  }
  removeSample(i: number) {
    if (this.sampleFormArray.length > 2) {
      this.sampleFormArray.removeAt(i);
    }
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
    this.selectedSamplesChange.next(samples);
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'selectedSamples':
            if (!this.selectedSamples || this.selectedSamples.length === 0) {
              // clear value
              this.sampleFormArray.clear();
              this.sampleFormArray.push(this.newSample());
              this.sampleFormArray.push(this.newSample());
            } else {
              this.sampleFormArray.clear();
              for (let i = 0; i < this.selectedSamples.length; i++) {
                const selectedSample = this.selectedSamples[i];
                this.sampleFormArray.push(this.newSample(selectedSample));
              }
            }
            break;
        }
      }
    }
  }
}
