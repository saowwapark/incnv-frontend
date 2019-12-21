import { ActivatedRoute } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Input,
  OnChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Sampleset } from 'src/app/sampleset/sampleset.model';

@Component({
  selector: 'app-choose-sampleset',
  templateUrl: './choose-sampleset.component.html',
  styleUrls: ['./choose-sampleset.component.scss']
})
export class ChooseSamplesetComponent implements OnInit, OnChanges {
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<Sampleset>();

  chosenSampleset: Sampleset;
  dataSource: MatTableDataSource<Sampleset>;

  displayedColumns = ['choose', 'samplesetName', 'description', 'samples'];

  constructor(private activateRoute: ActivatedRoute) {}

  ngOnChanges() {}
  ngOnInit() {
    const samplesets = this.activateRoute.snapshot.data['samplesets'];
    this.dataSource = new MatTableDataSource(samplesets);
    this.dataSource.sort = this.matSort;
  }

  chooseSampleset(sampleset) {
    // MatRadioChange.value
    this.chosenSampleset = sampleset;
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  goToNextStep() {
    this.nextStep.emit(this.chosenSampleset);
  }

  goToPreviousStep() {
    this.previousStep.next();
  }
}
