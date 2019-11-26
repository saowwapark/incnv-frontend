import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SelectedBarType } from './selected-bar-type.model';

@Component({
  selector: 'app-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent {
  @Input() selectedData: any[];
  @Input() selectedBarType: number;

  @Output() submitEmitter = new EventEmitter<any[]>();
  @Output() deselectAllEmitter = new EventEmitter<void>();

  SelectedBarType = SelectedBarType;

  deselectAll() {
    // Trigger the next event
    this.deselectAllEmitter.next();
  }

  submitAllSelected() {
    this.submitEmitter.next(this.selectedData);
  }
}
// export class SelectedBarComponent implements OnInit {
//   @Input() service: SelectedBarInterface<any>;
//   @Input() selectedBarType: number;
//   SelectedBarType = SelectedBarType;
//   selectedRows: any[];
//   confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

//   rowLength: number;
//   constructor(public _matDialog: MatDialog) {}
//   ngOnInit() {
//     this.service.onSelectedChanged.subscribe(selectedRows => {
//       this.rowLength = selectedRows.length;
//     });
//   }
//   deselectAll() {
//     // Trigger the next event
//     this.service.onSelectedChanged.next([]);
//   }

//   onSubmitAllSelected() {
//     this.service.submitAllSelected();
//   }
// }
