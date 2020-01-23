import { map } from 'rxjs/operators';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-choose-many-sample',
  templateUrl: './choose-many-sample.component.html',
  styleUrls: ['./choose-many-sample.component.scss']
})
export class ChooseManySampleComponent implements OnInit {
  @Input() samples: string[];
  @Output() selectSamples = new EventEmitter<string[]>();

  parentForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.parentForm = this.fb.group({
      sampleFormArray: this.fb.array([this.newSample()])
    });
  }

  get sampleFormArray(): FormArray {
    return this.parentForm.get('sampleFormArray') as FormArray;
  }

  newSample(): FormGroup {
    return this.fb.group({
      sample: ''
    });
  }
  addSamples() {
    this.sampleFormArray.push(this.newSample());
  }
  removeSample(i: number) {
    this.sampleFormArray.removeAt(i);
  }

  onSubmit() {
    console.log(this.sampleFormArray);
    const array = this.sampleFormArray.value;
    const data = array.map(d => d.sample);
    return this.selectSamples.next(data);
  }
  ngOnInit() {}
}
