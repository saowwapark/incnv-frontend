import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choose-sample',
  templateUrl: './choose-sample.component.html',
  styleUrls: ['./choose-sample.component.scss']
})
export class ChooseSampleComponent implements OnInit {
  @Input() samples: string[];
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<string>();
  selectedSample: string;
  constructor() {
    this.selectedSample = '';
  }

  ngOnInit() {}

  goToNextStep() {
    this.nextStep.emit(this.selectedSample);
  }

  goToPreviousStep() {
    this.previousStep.next();
  }
}
