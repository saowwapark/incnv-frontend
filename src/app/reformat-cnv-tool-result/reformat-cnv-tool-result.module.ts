import { ReformatDialogComponent } from './reformat-cnv-tool-result-table/reformat-dialog/reformat-dialog.component';
import { ReformatListComponent } from './reformat-cnv-tool-result-table/reformat-list/reformat-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { ReformatCnvToolResultTableComponent } from './reformat-cnv-tool-result-table/reformat-cnv-tool-result-table.component';
import { ReformatCnvToolResultService } from './reformat-cnv-tool-result.service';

@NgModule({
  declarations: [
    ReformatCnvToolResultTableComponent,
    ReformatListComponent,
    ReformatDialogComponent
  ],
  imports: [ReactiveFormsModule, SharedModule],
  exports: [ReformatCnvToolResultTableComponent],
  providers: [ReformatCnvToolResultService],
  entryComponents: [ReformatDialogComponent]
})
export class ReformatCnvToolResultModule {}
