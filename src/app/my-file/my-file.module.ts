import { MyFileRoutingModule } from './my-file-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { MyFileReformatCnvToolResultComponent } from './my-file-reformat-cnv-tool-result/my-file-reformat-cnv-tool-result.component';
import { MyFileUploadCnvToolResultComponent } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result.component';
// eslint-disable-next-line max-len
import { MyFileUploadCnvToolResultListComponent } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result-list/my-file-upload-cnv-tool-result-list.component';
import { ReformatCnvToolResultModule } from '../reformat-cnv-tool-result/reformat-cnv-tool-result.module';
import { UploadDialogComponent } from './my-file-upload-cnv-tool-result/upload-dialog/upload-dialog.component';
import { UploadDialogService } from './my-file-upload-cnv-tool-result/upload-dialog/upload-dialog.service';
import { UploadConfigureService } from '../upload-configure/upload-configure.service';
import { MyFileUploadCnvToolResultService } from './my-file-upload-cnv-tool-result/my-file-upload-cnv-tool-result.service';
import { UploadFormService } from '../upload-configure/configure-upload-cnv-tool-result/upload-form/upload-form.service';
import { ConfigureCnvToolFilesService } from '../services/configure-cnv-tool-files.service';
import { UploadHistoryService } from './my-file.service';
@NgModule({
  declarations: [
    MyFileReformatCnvToolResultComponent,
    MyFileUploadCnvToolResultComponent,
    MyFileUploadCnvToolResultListComponent,
    UploadDialogComponent
  ],
  imports: [SharedModule, MyFileRoutingModule, ReformatCnvToolResultModule],
  providers: [
    UploadDialogService,
    UploadConfigureService,
    MyFileUploadCnvToolResultService,
    UploadFormService,
    ConfigureCnvToolFilesService,
    UploadHistoryService,
  ],
  entryComponents: [UploadDialogComponent]
})
export class MyFileModule {}
