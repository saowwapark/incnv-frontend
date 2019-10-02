import { LayoutComponent } from './layout/layout.component';
import { UploadFormResolver } from './upload/upload-configure/upload-form/upload-form.resolver';
import { UploadListComponent } from './upload/upload-history/upload-list/upload-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
import { ActivitiesComponent } from './activities/activities.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './auth/login/login.component';
import { ConfigureCNVtoolsComponent } from './configure-cnv-tools/configure-cnv-tools.component';
import { ChromosomeComponent } from './chromosome/chromosome.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SamplesetComponent } from './sampleset/sampleset.component';
import { ChooseFilesComponent } from './analysis/choose-files/choose-files.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UploadConfigureComponent } from './upload/upload-configure/upload-configure.component';
import { UploadHistoryComponent } from './upload/upload-history/upload-history.component';

import { AuthGuard } from './auth/auth.guard';
import { UploadService } from './upload/upload.service';
import { TabFileMappingComponent } from './cnvtools/tab-file-mapping/tab-file-mapping.component';
import { TabFileMappingService } from './cnvtools/tab-file-mapping/tab-file-mapping.service';
import { SamplesetService } from './sampleset/sampleset.service';
import { FileListComponent } from './analysis/choose-files/file-list/file-list.component';
import { UploadFormComponent } from './upload/upload-configure/upload-form/upload-form.component';
import { HomeContentComponent } from './home/home-content/home-content.component';

const appRoutes: Routes = [
  // level1
  { path: '', component: HomeContentComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'configurecnvtools', component: ConfigureCNVtoolsComponent },
  { path: 'configureheaderfields', component: ConfigureHeaderFieldsComponent },
  { path: 'analysis', redirectTo: 'choosefiles' },
  {
    path: 'choosefiles',
    component: ChooseFilesComponent,
    resolve: { uploads: UploadService, samplesets: SamplesetService }
  },
  {
    path: 'filelist',
    component: FileListComponent,
    resolve: { uploads: UploadService, samplesets: SamplesetService }
  },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'chromosome', component: ChromosomeComponent },
  {
    path: 'sampleset',
    component: SamplesetComponent,
    canActivate: [AuthGuard]
  },
  { path: 'sampleset/:id', component: SamplesetComponent },

  {
    path: 'configurefile',
    component: UploadConfigureComponent,
    // canActivate: [AuthGuard],
    resolve: { uploads: UploadService, uploadForm: UploadFormResolver }
  },

  {
    path: 'uploadform',
    component: UploadFormComponent,
    resolve: { uploads: UploadService, uploadForm: UploadFormResolver }
  },

  {
    path: 'uploadlist',
    component: UploadListComponent,
    resolve: { uploads: UploadService, samplesets: SamplesetService }
  },
  {
    path: 'uploadhistory',
    component: UploadHistoryComponent
  },
  {
    path: 'tabfilemapping',
    component: TabFileMappingComponent,
    resolve: { tabFileMappings: TabFileMappingService }
  },
  {
    path: 'layout',
    component: LayoutComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
