import { SearchUtils } from '../../common/search.utils';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';

import { Upload } from './upload.model';
import { SampleSet } from 'src/app/sampleset/sampleset.model';
import { SampleSetService } from 'src/app/sampleset/sampleset.service';

@Injectable()
export class UploadsService implements Resolve<any> {
  onUploadsChanged: BehaviorSubject<any>;
  onSelectedUploadsChanged: BehaviorSubject<any>;
  onSearchTextChanged: Subject<any>;
  onFilterChanged: Subject<any>;

  uploads: Upload[];
  cnvTool: any;
  selectedUploads: number[] = [];

  searchText: string;
  filterBy: string;

  sampleSetNames: string[] = [];
  sampleSets: SampleSet[];
  sampleSetService = new SampleSetService();

  constructor(private _httpClient: HttpClient) {
    // Set the defaults
    this.onUploadsChanged = new BehaviorSubject([]);
    this.onSelectedUploadsChanged = new BehaviorSubject([]);
    this.onSearchTextChanged = new Subject();
    this.onFilterChanged = new Subject();

    this.sampleSets = this.sampleSetService.getSampleSets();
    this.sampleSetNames = this.getSampleSetNames();
  }
  getSampleSetNames(): string[] {
    const sampleSetNames: string[] = [];
    this.sampleSets.forEach(sampleSet => {
      sampleSetNames.push(sampleSet.name);
    });
    return sampleSetNames;
  }
  /**
   * Load upload data from database before load this component.
   */
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      this.getUploads().then(([files]) => {
        this.onSearchTextChanged.subscribe(searchText => {
          this.searchText = searchText;
          this.getUploads();
        });

        this.onFilterChanged.subscribe(filter => {
          this.filterBy = filter;
          this.getUploads();
        });

        resolve();
      }, reject);
    });
  }

  /**
   * Get uploads
   */
  getUploads(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/uploads-uploads').subscribe((response: any) => {
        this.uploads = response;
        if (this.searchText && this.searchText !== '') {
          this.uploads = SearchUtils.filterArrayByString(
            this.uploads,
            this.searchText
          );
        }

        this.uploads = this.uploads.map(upload => {
          return new Upload(upload);
        });
        this.onUploadsChanged.next(this.uploads);
        resolve(this.uploads);
      }, reject);
    });
  }

  /**
   * Update upload
   *
   */
  updateUpload(upload): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient
        .post('api/contacts-contacts/' + upload.id, { ...upload })
        .subscribe(response => {
          this.getUploads();
          resolve(response);
        });
    });
  }

  /**
   * Delete contact
   *
   */
  deleteUpload(upload): void {
    const uploadIndex = this.uploads.indexOf(upload);
    this.uploads.splice(uploadIndex, 1);
    this.onUploadsChanged.next(this.uploads);
  }

  /**
   * Select uploads
   */
  selectUploads(filterParameter?, filterValue?): void {
    this.selectedUploads = [];

    // If there is no filter, select all contacts
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedUploads = [];
      this.uploads.map(upload => {
        this.selectedUploads.push(upload.id);
      });
    }

    // Trigger the next event
    this.onSelectedUploadsChanged.next(this.selectedUploads);
  }
  /**
   * Deselect uploads
   */
  deselectUploads(): void {
    this.selectedUploads = [];

    // Trigger the next event
    this.onSelectedUploadsChanged.next(this.selectedUploads);
  }

  /**
   * Toggle selected contact by id
   *
   */
  toggleSelectedUpload(id): void {
    // First, check if we already have that contact as selected...
    if (this.selectedUploads.length > 0) {
      const index = this.selectedUploads.indexOf(id);

      if (index !== -1) {
        this.selectedUploads.splice(index, 1);

        // Trigger the next event
        this.onSelectedUploadsChanged.next(this.selectedUploads);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedUploads.push(id);

    // Trigger the next event
    this.onSelectedUploadsChanged.next(this.selectedUploads);
  }

  /**
   * Toggle select all
   */
  toggleSelectAll(): void {
    if (this.selectedUploads.length > 0) {
      this.deselectUploads();
    } else {
      this.selectUploads();
    }
  }
}
