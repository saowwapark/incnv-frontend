import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchUtils } from '../../common/search.utils';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { TabFileMapping } from './tab-file-mapping.model';
import { UploadFormService } from 'src/app/upload/upload-configure/upload-form/upload-form.service';

@Injectable()
export class TabFileMappingService implements Resolve<any> {
  fileMappingConfigureds: TabFileMapping[];
  searchText: string;

  onTabFileMappingsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;

  constructor(
    private _httpClient: HttpClient,
    private _uploadFormService: UploadFormService
  ) {
    this.onTabFileMappingsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([this.getTabFileMapping()]).then(() => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getTabFileMapping();
        });
        resolve();
      }, reject);
    });
  }

  /**
   * Update tabFileMapping configured
   *
   */
  updateTabFileMapping(fileMappingConfigured: TabFileMapping): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/tab-fileMappings/' + fileMappingConfigured.id, {
          ...fileMappingConfigured
        })
        .subscribe(response => {
          this._uploadFormService.onTapFileMappingChanged.next(
            'TabFileMapping triggers to uploadForm.'
          );
          this.getTabFileMapping();
          resolve(response);
        });
    });
  }

  /**
   * Delete TabFileMapping Configured
   *
   */
  deleteTabFileMapping(fileMappingConfigured): void {
    const fileMappingIndex = this.fileMappingConfigureds.indexOf(
      fileMappingConfigured
    );
    this.fileMappingConfigureds.splice(fileMappingIndex, 1);
    this.onTabFileMappingsChanged.next(this.fileMappingConfigureds);
  }
  getTabFileMapping(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .get('api/tab-fileMappings')
        .subscribe((response: any) => {
          this.fileMappingConfigureds = response;
          if (this.searchText && this.searchText !== '') {
            this.fileMappingConfigureds = SearchUtils.filterArrayByString(
              this.fileMappingConfigureds,
              this.searchText
            );
          }
          this.onTabFileMappingsChanged.next(this.fileMappingConfigureds);
          resolve(this.fileMappingConfigureds);
        }, reject);
    });
  }
}
