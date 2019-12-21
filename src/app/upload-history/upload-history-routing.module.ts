import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HistoryUploadCnvToolResultComponent } from './history-upload-cnv-tool-result/history-upload-cnv-tool-result.component';
import { HistoryReformatCnvToolResultComponent } from './history-reformat-cnv-tool-result/history-reformat-cnv-tool-result.component';
const routes: Routes = [
  {
    path: 'uploadhistory',
    component: HistoryUploadCnvToolResultComponent
  },
  {
    path: 'reformat/:id',
    component: HistoryReformatCnvToolResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadHistoryRoutingModule {}
