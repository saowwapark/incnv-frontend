import { CnvFragmentAnnotation } from 'src/app/analysis/analysis.model';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-selected-cnv',
  templateUrl: './selected-cnv.component.html',
  styleUrls: ['./selected-cnv.component.scss']
})
export class SelectedCnvComponent implements OnInit, OnChanges {
  // @Input() selectedCnvs: CnvFragmentAnnotation[];
  // dataSource;
  @Input() dataSource: CnvFragmentAnnotation[];
  displayedColumns = [
    'no',
    'chromosome',
    'startBp',
    'endBp',
    'cnvType',
    'overlapTools',
    'edit',
    'delete'
  ];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(): void {
    console.log(this.dataSource);
  }

  editRow() {}

  deleteRow() {}

  addRow() {}
}
