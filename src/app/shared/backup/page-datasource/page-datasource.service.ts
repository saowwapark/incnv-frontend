import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export abstract class PageDataSourceService<T> {
  onSearchTextChanged: Subject<string>;
  onFilterChanged: Subject<string>;
  onTriggerDataChanged: Subject<void>;
  abstract findData(
    search: string,
    sortOrder: string,
    pageNumber: number,
    pageSize: number
  ): Observable<T[]>;
  abstract countRecords(search: string): Observable<number>;
}
