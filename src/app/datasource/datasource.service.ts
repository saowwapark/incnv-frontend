import { HttpClient } from '@angular/common/http';
import { ConstantsService } from '../services/constants.service';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DatasourceService {
    baseRouteUrl: string;
    private allDownloadsCompletedSubject = new Subject<void>();

    constructor(private _http: HttpClient, private _constant: ConstantsService) {
        this.baseRouteUrl = `${this._constant.baseAppUrl}/api/datasource`;
    }
    updatedDasource(): Observable<string> {
        return new Observable<string>(observer => {
            const url = this.baseRouteUrl + '/update-datasource';
            const eventSource = new EventSource(url);
            eventSource.onmessage = event => {
                observer.next(event.data)
            };

            eventSource.onerror = error => {
                if (error.eventPhase === EventSource.CLOSED) {
                    console.log('SSE connection closed');
                    eventSource.close();
                    this.notifyAllDownloadsCompleted();
                } else {
                    observer.error(error)
                }
            };
        });
    }

    isShouldUpdateDatasource(): Observable<boolean> {
        return this._http
          .get(`${this.baseRouteUrl}/check-updated-datasource`)
          .pipe(map(res => res['payload']));
      }
    notifyAllDownloadsCompleted(): void {
        this.allDownloadsCompletedSubject.next();
        this.allDownloadsCompletedSubject.complete();
    }

    onAllDownloadsCompleted(): Observable<void> {
        return this.allDownloadsCompletedSubject.asObservable();
    }
}