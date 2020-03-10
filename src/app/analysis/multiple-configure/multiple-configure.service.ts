import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';

@Injectable({
  providedIn: 'root'
})
export class MultipleConfigureService {
  onSelectedSamplesChanged: BehaviorSubject<string[]>;
  constructor() {
    this.onSelectedSamplesChanged = new BehaviorSubject([]);
  }
}
