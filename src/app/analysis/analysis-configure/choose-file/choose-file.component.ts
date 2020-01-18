import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AnalysisConfigureService } from '../analysis-configure.service';
import { myAnimations } from 'src/app/shared/animations';

@Component({
  selector: 'app-choose-file',
  templateUrl: './choose-file.component.html',
  styleUrls: ['./choose-file.component.scss'],
  animations: myAnimations
})
export class ChooseFileComponent
  implements OnChanges, OnInit, OnDestroy, AfterViewInit {
  @Input() samplesetId: number;
  @Input() referenceGenome: string;
  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<UploadCnvToolResult[]>();
  displayedColumns = [
    'select',
    'fileName',
    'fileInfo',
    'cnvToolName',
    'tagDescriptions',
    'createdDate'
  ];

  dataSource: MatTableDataSource<UploadCnvToolResult>;
  selection = new SelectionModel<UploadCnvToolResult>(true, []);
  selectedFiles: UploadCnvToolResult[];
  isLoadingResults = true;

  @ViewChild(MatSort, { static: true }) matSort: MatSort;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(private _service: AnalysisConfigureService) {
    this.selectedFiles = [];
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {}

  ngOnChanges() {
    this._service
      .getUploadCnvToolResults(this.referenceGenome, this.samplesetId)
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(UploadCnvToolResults => {
        this.dataSource = new MatTableDataSource(UploadCnvToolResults);
        this.dataSource.sort = this.matSort;
      });
  }

  ngAfterViewInit() {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  /** Stepper */
  goToNextStep() {
    this.nextStep.emit(this.selectedFiles);
  }

  goToPreviousStep() {
    this.previousStep.next();
  }
  /************************* Select **************************/
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(sampleset =>
          this.selection.select(sampleset)
        );
    this.selectedFiles = this.selection.selected;
  }

  toggleRow(upload: UploadCnvToolResult) {
    this.selection.toggle(upload);
    this.selectedFiles = this.selection.selected;
  }
}
