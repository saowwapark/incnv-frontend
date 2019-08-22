import { Sampleset } from './sampleset.model';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchUtils } from '../common/search.utils';

@Injectable()
export class SamplesetService {
  samplesets: Sampleset[];
  searchText: string;
  onSamplesetsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;

  constructor(private _httpClient: HttpClient) {
    this.onSamplesetsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getSampleSets()]).then(() => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getSampleSets();
        });
        resolve();
      }, reject);
    });
  }

  getSampleSets(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/samplesets').subscribe((response: any) => {
        this.samplesets = response;
        if (this.searchText && this.searchText !== '') {
          this.samplesets = SearchUtils.filterArrayByString(
            this.samplesets,
            this.searchText
          );
        }
        this.onSamplesetsChanged.next(this.samplesets);
        resolve(this.samplesets);
      }, reject);
    });
  }
  /**
   * Update Sampleset
   *
   */
  updateSampleset(sampleset: Sampleset): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/samplesets/' + sampleset.id, {
          ...sampleset
        })
        .subscribe(response => {
          this.getSampleSets();
          resolve(response);
        });
    });
  }

  /**
   * Delete Sampleset
   *
   * @param sampleset
   */
  deleteSampleset(sampleset): void {
    const samplesetIndex = this.samplesets.indexOf(sampleset);
    this.samplesets.splice(samplesetIndex, 1);
    this.onSamplesetsChanged.next(this.samplesets);
  }
}
