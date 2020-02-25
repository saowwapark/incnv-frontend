import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MyFileUploadCnvToolResultComponent } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result.component';
import { MyFileReformatCnvToolResultComponent } from './my-file-reformat-cnv-tool-result/my-file-reformat-cnv-tool-result.component';
const routes: Routes = [
  {
    path: 'myfiles',
    component: MyFileUploadCnvToolResultComponent
  },
  {
    path: 'reformat/:id',
    component: MyFileReformatCnvToolResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyFileRoutingModule {}
