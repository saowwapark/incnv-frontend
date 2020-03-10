import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Sampleset } from 'src/app/sampleset/sampleset.model';

@Injectable({
  providedIn: 'root'
})
export class MultipleConfigureService {
  onSelectedSamplesChange: BehaviorSubject<string[]>;
  constructor() {
    this.onSelectedSamplesChange = new BehaviorSubject([]);
  }
}
