import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchUtils } from '../../common/search.utils';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TabFileMappingConfigured } from './tab-file-mapping.model';

@Injectable()
export class TabFileMappingService implements Resolve<any> {
  fileMappingConfigureds: TabFileMappingConfigured[];
  searchText: string;

  onTabFileMappingConfiguredsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;

  constructor(private _httpClient: HttpClient) {
    this.onTabFileMappingConfiguredsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getTabFileMappingConfigured()]).then(() => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getTabFileMappingConfigured();
        });
        resolve();
      }, reject);
    });
  }

  /**
   * Update tabFileMapping configured
   *
   */
  updateTabFileMappingConfigured(
    fileMappingConfigured: TabFileMappingConfigured
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/fileMappings/' + fileMappingConfigured.id, {
          ...fileMappingConfigured
        })
        .subscribe(response => {
          this.getTabFileMappingConfigured();
          resolve(response);
        });
    });
  }

  /**
   * Delete TabFileMapping Configured
   *
   * @param contact
   */
  deleteTabFileMappingConfigured(fileMappingConfigured): void {
    const fileMappingIndex = this.fileMappingConfigureds.indexOf(
      fileMappingConfigured
    );
    this.fileMappingConfigureds.splice(fileMappingIndex, 1);
    this.onTabFileMappingConfiguredsChanged.next(this.fileMappingConfigureds);
  }
  getTabFileMappingConfigured(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/fileMappings').subscribe((response: any) => {
        this.fileMappingConfigureds = response;
        if (this.searchText && this.searchText !== '') {
          this.fileMappingConfigureds = SearchUtils.filterArrayByString(
            this.fileMappingConfigureds,
            this.searchText
          );
        }
        this.onTabFileMappingConfiguredsChanged.next(this.fileMappingConfigureds);
        resolve(this.fileMappingConfigureds);
      }, reject);
    });
  }
}
