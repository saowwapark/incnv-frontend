import { SamplesetService } from 'src/app/sampleset/sampleset.service';
import { Observable } from 'rxjs';
import { Sampleset } from './sampleset.model';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
@Injectable()
export class SamplesetResolver implements Resolve<Observable<Sampleset[]>> {
  constructor(private samplesetService: SamplesetService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Sampleset[]> {
    return this.samplesetService.getSamplesets();
  }
}

// getSampleSets(): Promise<any[]> {
//   const url = `${this._constant.baseAppUrl}api/sampleset/all-samplesets`;
//   const param = new HttpParams().set('userId', '1');

//   return new Promise((resolve, reject) => {
//     this._http.get(url, { params: param }).subscribe((response: any) => {
//       this.samplesets = response.post;
//       console.log(this.samplesets);
//       if (this.searchText && this.searchText !== '') {
//         this.samplesets = SearchUtils.filterArrayByString(
//           this.samplesets,
//           this.searchText
//         );
//       }
//       this.onSamplesetsChanged.next(this.samplesets);
//       resolve(this.samplesets);
//     }, reject);
//   });
// }
// /**
//  * Add Sampleset
//  *
//  */
// addSampleset(sampleset: Sampleset): Promise<any> {
//   return new Promise((resolve, reject) => {
//     this._http
//       .post('api/samplesets/' + sampleset.samplesetId, {
//         ...sampleset
//       })
//       .subscribe(response => {
//         this.getSampleSets();
//         this._uploadFormService.onSamplesetsChanged.next(
//           'Sampleset triggers to uploadForm.'
//         );
//         resolve(response);
//       });
//   });
// }

// /**
//  * Delete Sampleset
//  *
//  */
// deleteSampleset(sampleset): void {
//   const samplesetIndex = this.samplesets.indexOf(sampleset);
//   this.samplesets.splice(samplesetIndex, 1);
//   this.onSamplesetsChanged.next(this.samplesets);
//   this._uploadFormService.onSamplesetsChanged.next(
//     'Sampleset triggers to uploadForm.'
//   );
// }
