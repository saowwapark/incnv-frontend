import { SampleSet } from './../../sampleset/sampleset.model';
import { ALL_UPLOAD_FILES } from './../../types/mock/ALL_UPLOAD_FILES';
import { Upload } from './../../configure-cnv-tools/upload/upload.model';
import { HeaderField } from 'src/app/types/header-field';

import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { SampleSetService } from 'src/app/sampleset/sampleset.service';
import { mapIdToName } from 'src/app/common/map.utils';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { HEADER_CODEX2 } from 'src/app/types/mock/ALL_CNV_HEADERS';

interface ChooseFileInfo {
  fileId: number;
  fileName: string;
  cnvToolName: string;
  sampleSetId: number;
  sampleSetName: string;
  tags: string[];
  date: Date;
  size: string;
}
@Component({
  selector: 'choose-files',
  templateUrl: './choose-files.component.html',
  styleUrls: ['./choose-files.component.scss'],
  providers: [SampleSetService],
  animations: [
    trigger('expandedElement', [
      state(
        'collapsed',
        style({ height: '0px', minHeight: '0', display: 'none' })
      ),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      )
    ])
    // trigger('expandFileName', [
    //   state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    //   state('expanded', style({height: '*'})),
    //   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
    // trigger('expandCnvToolName', [
    //   state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    //   state('expanded', style({height: '*'})),
    //   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
    // trigger('expandSampleSet', [
    //   state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
    //   state('expanded', style({height: '*'})),
    //   transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    // ]),
  ]
})
export class ChooseFilesComponent implements OnInit {
  uploadFileInfos = ALL_UPLOAD_FILES;
  sampleSets: SampleSet[];

  displayedColumns = [
    'select',
    'fileName',
    'cnvToolName',
    'sampleSet',
    'tags',
    'date',
    'size',
    'download'
  ];
  dataSource: MatTableDataSource<ChooseFileInfo>;

  cnvToolNameDataSource: HeaderField[];
  selection = new SelectionModel<ChooseFileInfo>(true, []);
  expandElem_fileName: ChooseFileInfo | null;
  expandElem_cnvToolName: ChooseFileInfo | null;
  expandElem_sampleSet: ChooseFileInfo | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private sampleSetService: SampleSetService) {}

  ngOnInit() {
    this.sampleSets = this.sampleSetService.getSampleSets();
    this.dataSource = new MatTableDataSource(this.initChooseFileInfos());
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cnvToolNameDataSource = [HEADER_CODEX2];
  }

  initChooseFileInfos(): ChooseFileInfo[] {
    const chooseFileInfos = [];
    this.uploadFileInfos.forEach(uploadFileInfo => {
      const chooseFileInfo: ChooseFileInfo = {
        fileId: uploadFileInfo.id,
        fileName: uploadFileInfo.fileName,
        cnvToolName: uploadFileInfo.cnvToolName,
        sampleSetId: uploadFileInfo.sampleSetId,
        sampleSetName: this.map(uploadFileInfo.sampleSetId, this.sampleSets),
        tags: uploadFileInfo.tags,
        date: uploadFileInfo.date,
        size: uploadFileInfo.size
      };
      chooseFileInfos.push(chooseFileInfo);
    });
    return chooseFileInfos;
  }

  map = (id: number, list: any[]): string => {
    return mapIdToName(id, list);
  };

  getSampleNames(sampleSetId: number) {
    let sampleNames: string[];
    this.sampleSets.forEach(sampleSet => {
      if (sampleSet.id === sampleSetId) {
        sampleNames = sampleSet.sampleNames;
      }
    });
    return sampleNames;
  }

  /************************* Collapse ************************/
  onFileName(element) {
    if (this.expandElem_fileName === element) {
      this.expandElem_fileName = null;
    } else {
      this.expandElem_fileName = element;
    }
  }
  onCnvtoolName(element) {
    if (this.expandElem_cnvToolName === element) {
      this.expandElem_cnvToolName = null;
    } else {
      this.expandElem_cnvToolName = element;
    }
  }
  onSampleSet(element) {
    if (this.expandElem_sampleSet === element) {
      this.expandElem_sampleSet = null;
    } else {
      this.expandElem_sampleSet = element;
    }
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
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /***************************  Filter **************************/
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterSampleSet() {}

  isChooseSameSampleSet() {}

  // initUploadForms(): FormArray {
  //   const uploadForms = new FormArray([]);
  //   this.uploadFileInfos.forEach(uploadFileInfo => {
  //     const uploadForm = new FormGroup({
  //       cnvToolName: new FormControl({value: uploadFileInfo.cnvToolName, disabled: true}),
  //       cnvToolFile: new FormControl({value: uploadFileInfo.fileName}),
  //       sampleSet: new FormControl({value: uploadFileInfo.sampleSetId, disabled: true}),
  //       tagDisease: new FormControl({value: uploadFileInfo.tagDiseaseId, disabled: true})
  //     });
  //     uploadForms.push(uploadForm);
  //   });
  //   return uploadForms;
  // }
}
