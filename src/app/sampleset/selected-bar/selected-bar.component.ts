import { Sampleset } from './../sampleset.model';
import { Component, OnInit } from '@angular/core';
import { SamplesetService } from '../sampleset.service';

import {
  MatDialog,
  MatDialogRef,
  MatDialogConfig
} from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/common/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-selected-bar',
  templateUrl: './selected-bar.component.html',
  styleUrls: ['./selected-bar.component.scss']
})
export class SelectedBarComponent implements OnInit {
  selectedSamplesets: Sampleset[];
  confirmDialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private _samplesetService: SamplesetService,
    public _matDialog: MatDialog
  ) {}
  ngOnInit() {
    this._samplesetService.onSelectedSamplesetsChanged.subscribe(
      selectedSamplesets => {
        this.selectedSamplesets = selectedSamplesets;
      }
    );
  }
  deselectAll() {
    // this.selectedSamplesets = [];

    // Trigger the next event
    this._samplesetService.onSelectedSamplesetsChanged.next([]);
  }

  onDeleteSelectedSamplesets() {
    this.confirmDialogRef = this._matDialog.open(ConfirmDialogComponent, {
      disableClose: false
    });

    let samplesetNames = '';
    this.selectedSamplesets.forEach(selectedSampleset => {
      samplesetNames += `, ${selectedSampleset.name}`;
    });
    this.confirmDialogRef.componentInstance.confirmMessage =
      'Are you sure you want to delete?' + samplesetNames;

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedSamplesets.forEach(selectedSampleset => {
          this._samplesetService
            .deleteSampleset(selectedSampleset.samplesetId)
            .subscribe();
        });
      }
      this.confirmDialogRef = null;
      this.deselectAll();
      this._samplesetService.isDataChanged.next();
    });
  }
}
