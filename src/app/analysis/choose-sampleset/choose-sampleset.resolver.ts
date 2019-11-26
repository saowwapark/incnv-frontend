import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { ConstantsService } from 'src/app/constants.service';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable()
export class ChooseSamplesetResolver
  implements Resolve<Observable<Sampleset[]>> {
  baseRouteUrl: string;
  constructor(private _http: HttpClient, private _constant: ConstantsService) {
    this.baseRouteUrl = `${this._constant.baseAppUrl}/api/analysis`;
  }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Sampleset[]> {
    const url = `${this.baseRouteUrl}/sampleset`;
    return this._http.get(url).pipe(map(res => res['payload']));
  }
}
