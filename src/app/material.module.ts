import { NgModule } from '@angular/core';

import { ScrollingModule } from '@angular/cdk/scrolling';

import {
  MatIconModule,
  MatToolbarModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatListModule,
  MatSelectModule,
  MatDividerModule,
  MatGridListModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatCheckboxModule,
  MatStepperModule,
  MatCardModule,
  MatSidenavModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatRadioModule
} from '@angular/material';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatGridListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatStepperModule,
    MatCardModule,
    MatSidenavModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    ScrollingModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ]
})
export class CustomMaterialModule {}
