import { UploadConfigureService } from './../upload-configure.service';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { ReformatCnvToolResult } from './upload-reformat.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-upload-reformat',
  templateUrl: './upload-reformat.component.html',
  styleUrls: ['./upload-reformat.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UploadReformatComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns = [
    'no',
    'sampleName',
    'chromosome',
    'startBasepair',
    'endBasepair',
    'cnvType'
  ];

  // Private
  private _unsubscribeAll: Subject<any>;
  // dataSource: UploadReformatDataSource | null;
  dataSource: MatTableDataSource<ReformatCnvToolResult>;
  constructor(private _uploadConfigureService: UploadConfigureService) {
    this._unsubscribeAll = new Subject();
  }

  ngOnInit() {
    console.log('upload-reformat.component.ts');
    // this.dataSource = new UploadReformatDataSource(
    //   this._uploadConfigureService
    // );

    this._uploadConfigureService.onUploadReformatsChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(reformatCnvToolResults => {
        this.dataSource = new MatTableDataSource(reformatCnvToolResults);
        this.dataSource.sort = this.sort;
      });
  }

  ngOnDestroy() {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
