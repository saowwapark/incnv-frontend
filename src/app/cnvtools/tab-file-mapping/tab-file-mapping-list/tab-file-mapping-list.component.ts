import { Component, OnInit, OnDestroy } from '@angular/core';
import { TabFileMappingConfigured } from '../tab-file-mapping.model';
import { TabFileMappingService } from '../tab-file-mapping.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-tab-file-mapping-list',
  templateUrl: './tab-file-mapping-list.component.html',
  styleUrls: ['./tab-file-mapping-list.component.scss']
})
export class TabFileMappingListComponent implements OnInit, OnDestroy {
  isLoading = false;
  fileMappingConfigureds: TabFileMappingConfigured[];

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _fileMappingService: TabFileMappingService) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }
  ngOnInit(): void {
    this._fileMappingService.onTabFileMappingConfiguredsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(fileMappingConfigureds => {
        this.fileMappingConfigureds = fileMappingConfigureds;
      });
  }
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
