import { ActivitiesRoutingModule } from './activities-routing.module';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { RecentAnalysisComponent } from './recent-analysis/recent-analysis.component';
import { RecentUploadFilesComponent } from './recent-upload-files/recent-upload-files.component';
import { ActivitiesComponent } from './activities.component';

@NgModule({
  declarations: [
    ActivitiesComponent,
    RecentAnalysisComponent,
    RecentUploadFilesComponent
  ],
  imports: [SharedModule, ActivitiesRoutingModule]
})
export class ActivitiesModule {}
