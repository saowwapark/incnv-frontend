import {
  Component,
  OnDestroy,
  ViewChild,
  Input,
  OnChanges,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { myAnimations } from 'src/app/shared/animations';
import { AnalysisConfigureService } from '../analysis-configure.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-choose-one-file',
  templateUrl: './choose-one-file.component.html',
  styleUrls: ['./choose-one-file.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: myAnimations
})
export class ChooseOneFileComponent implements OnChanges, OnDestroy {
  @Input() samplesetId: number;
  @Input() referenceGenome: string;
  @Input() selectedFile: UploadCnvToolResult;
  @Output() selectedFileChange = new EventEmitter<UploadCnvToolResult>();
  displayedColumns = [
    'select',
    'fileName',
    'fileInfo',
    'cnvToolName',
    'tagDescriptions',
    'createdDate'
  ];

  dataSource: MatTableDataSource<UploadCnvToolResult> = new MatTableDataSource(
    []
  );
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  selectedFiles: UploadCnvToolResult[];
  isLoadingResults = true;

  @ViewChild(MatSort, { static: true }) matSort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _service: AnalysisConfigureService) {
    this.selectedFiles = [];
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnChanges() {
    this._service
      .getUploadCnvToolResults(this.referenceGenome, this.samplesetId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(UploadCnvToolResults => {
        this.dataSource = new MatTableDataSource(UploadCnvToolResults);
        this.dataSource.sort = this.matSort;
        this.dataSource.paginator = this.paginator;
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}