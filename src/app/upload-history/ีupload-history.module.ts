import { UploadHistoryRoutingModule } from './upload-history-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { UploadHistoryComponent } from './upload-history.component';
import { HistoryReformatCnvToolResultComponent } from './history-reformat-cnv-tool-result/history-reformat-cnv-tool-result.component';
import { HistoryUploadCnvToolResultComponent } from './history-upload-cnv-tool-result/history-upload-cnv-tool-result.component';
import { HistoryUploadCnvToolResultListComponent } from './history-upload-cnv-tool-result/history-upload-cnv-tool-result-list/history-upload-cnv-tool-result-list.component';

@NgModule({
  declarations: [
    UploadHistoryComponent,
    HistoryReformatCnvToolResultComponent,
    HistoryUploadCnvToolResultComponent,
    HistoryUploadCnvToolResultListComponent
  ],
  imports: [SharedModule, UploadHistoryRoutingModule]
})
export class UploadHistoryModule {}
