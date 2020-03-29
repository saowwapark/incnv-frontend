import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-choose-one-sample',
  templateUrl: './choose-one-sample.component.html',
  styleUrls: ['./choose-one-sample.component.scss']
})
export class ChooseOneSampleComponent implements OnInit {
  @Input() samples: string[];
  @Input() selectedSample: string;
  @Output() selectedSampleChange = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  // // not working cannot bind new @Input
  // ngOnChanges(changes: SimpleChanges) {
  //   for (const propName in changes) {
  //     if (changes.hasOwnProperty(propName)) {
  //       switch (propName) {
  //         case 'selectedSample':
  //           console.log(this.selectedSample);
  //           break;
  //       }
  //     }
  //   }
  // }
}
