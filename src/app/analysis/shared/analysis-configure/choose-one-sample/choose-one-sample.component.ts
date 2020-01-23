import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choose-one-sample',
  templateUrl: './choose-one-sample.component.html',
  styleUrls: ['./choose-one-sample.component.scss']
})
export class ChooseOneSampleComponent implements OnInit {
  @Input() samples: string[];
  @Output() selectSample = new EventEmitter<string>();
  selectedSample: string;
  constructor() {
    this.selectedSample = '';
  }

  ngOnInit() {}
}
