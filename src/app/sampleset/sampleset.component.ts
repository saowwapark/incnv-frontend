import { SampleSet } from './sampleset.model';
import { SampleSetService } from './sampleset.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sampleset',
  templateUrl: './sampleset.component.html',
  styleUrls: ['./sampleset.component.scss'],
  providers: [SampleSetService]
})
export class SampleSetComponent implements OnInit {
  sampleSets: SampleSet[];
  constructor(private sampleSetService: SampleSetService) {}

  ngOnInit() {
    this.sampleSets = this.sampleSetService.getSampleSets();
  }
}
