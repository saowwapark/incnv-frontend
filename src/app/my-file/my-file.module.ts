import { MyFileComponent } from './my-file.component';
import { MyFileRoutingModule } from './my-file-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { MyFileReformatCnvToolResultComponent } from './my-file-reformat-cnv-tool-result/my-file-reformat-cnv-tool-result.component';
import { MyFileUploadCnvToolResultComponent } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result.component';
import { MyFileUploadCnvToolResultListComponent } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result-list/my-file-upload-cnv-tool-result-list.component';
import { ReformatCnvToolResultModule } from '../reformat-cnv-tool-result/reformat-cnv-tool-result.module';
import { UploadDialogComponent } from './my-file-upload-cnv-tool-result/upload-dialog/upload-dialog.component';

@NgModule({
  declarations: [
    MyFileComponent,
    MyFileReformatCnvToolResultComponent,
    MyFileUploadCnvToolResultComponent,
    MyFileUploadCnvToolResultListComponent,
    UploadDialogComponent
  ],
  imports: [SharedModule, MyFileRoutingModule, ReformatCnvToolResultModule],
  entryComponents: [UploadDialogComponent]
})
export class MyFileModule {}
