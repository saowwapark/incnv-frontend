import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { UploadConfigureComponent } from './upload-configure.component';
import { UploadFormComponent } from './configure-upload-cnv-tool-result/upload-form/upload-form.component';
import { PreviewReformatCnvToolResultComponent } from './preview-reformat-cnv-tool-result/preview-reformat-cnv-tool-result.component';
import { ReformatDialogComponent } from './preview-reformat-cnv-tool-result/reformat-dialog/reformat-dialog.component';
import { ReformatListComponent } from './preview-reformat-cnv-tool-result/reformat-list/reformat-list.component';
import { UploadConfigureRoutingModule } from './upload-configure-routing.module';

@NgModule({
  declarations: [
    UploadConfigureComponent,
    UploadFormComponent,
    PreviewReformatCnvToolResultComponent,
    ReformatDialogComponent,
    ReformatListComponent
  ],
  imports: [ReactiveFormsModule, SharedModule, UploadConfigureRoutingModule],
  entryComponents: [ReformatDialogComponent]
})
export class UploadConfigureModule {}
