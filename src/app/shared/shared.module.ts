import { UnmaskNumericDirective } from './directives/unmask-numeric.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectedBarComponent } from './../shared/components/selected-bar/selected-bar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FilteredSelectComponent } from './components/filtered-select/filtered-select.component';

@NgModule({
  declarations: [
    SelectedBarComponent,
    FilteredSelectComponent,
    UnmaskNumericDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  exports: [
    SelectedBarComponent,
    FilteredSelectComponent,
    UnmaskNumericDirective,
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class SharedModule {}
