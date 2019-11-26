import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter
} from '@angular/core';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-choose-sampleset',
  templateUrl: './choose-sampleset.component.html',
  styleUrls: ['./choose-sampleset.component.scss']
})
export class ChooseSamplesetComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  chosenSampleset: Sampleset;
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<Sampleset>();

  dataSource: MatTableDataSource<Sampleset>;
  samplesets: Sampleset[];

  displayedColumns = ['choose', 'samplesetName', 'description', 'samples'];

  constructor(
    private _samplesetService: SamplesetService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.samplesets = this.route.snapshot.data['samplesets'];
    this.dataSource = new MatTableDataSource(this.samplesets);
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
