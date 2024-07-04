import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DatasourceService as DatasourceService } from './datasource.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'datasource',
  templateUrl: './datasource.component.html',
  styleUrls: ['./datasource.component.scss'],
})
export class DatasourceComponent implements OnInit, OnDestroy  {
  messages: string[] = [];
  private _unsubscribeAll: Subject<void>;
  constructor( private datasourceService: DatasourceService, private cdr: ChangeDetectorRef) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    this.updateDataSource();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  updateDataSource() {
    this.datasourceService.updatedDasource()
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(status => {
        this.messages.push(status);
        this.cdr.detectChanges();
      }, error => {
        console.error('Error receiving download status:', error);
      });
  }
}