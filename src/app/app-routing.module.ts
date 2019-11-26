import { CompareResultComponent } from './analysis/compare-result/compare-result.component';
import { ChooseSamplesetResolver } from './analysis/choose-sampleset/choose-sampleset.resolver';
import { AnalysisComponent } from './analysis/analysis.component';
import { SamplesetResolver } from './sampleset/sampleset.resolver';
import { UploadHistoryUploadcnvtoolresultComponent } from './upload/upload-history/upload-history-uploadcnvtoolresult/upload-history-uploadcnvtoolresult.component';
import { IgvComponent } from './igv/igv.component';
import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
// import { ConfigureCNVtoolsComponent } from './configure-cnv-tools/configure-cnv-tools.component';
import { ActivitiesComponent } from './activities/activities.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './authen/login/login.component';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './authen/signup/signup.component';
import { SamplesetComponent } from './sampleset/sampleset.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { UploadConfigureComponent } from './upload/upload-configure/upload-configure.component';
import { UploadHistoryComponent } from './upload/upload-history/upload-history.component';

import { AuthenGuard } from './authen/authen.guard';
import { TabFileMappingComponent } from './cnvtools/tab-file-mapping/tab-file-mapping.component';
import { TabFileMappingService } from './cnvtools/tab-file-mapping/tab-file-mapping.service';
import { SamplesetService } from './sampleset/sampleset.service';
import { UploadFormComponent } from './upload/upload-configure/upload-form/upload-form.component';
import { HomeContentComponent } from './home/home-content/home-content.component';

const appRoutes: Routes = [
  // level1
  { path: '', component: HomeContentComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  // { path: 'configurecnvtools', component: ConfigureCNVtoolsComponent },
  // { path: 'configureheaderfields', component: ConfigureHeaderFieldsComponent },
  // { path: 'analysis', redirectTo: 'choosefiles' },
  // {
  //   path: 'choosefiles',
  //   component: ChooseFilesComponent,
  //   resolve: { uploads: UploadService, samplesets: SamplesetService }
  // },
  // {
  //   path: 'filelist',
  //   component: FileListComponent,
  //   resolve: { uploads: UploadService, samplesets: SamplesetService }
  // },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'igv', component: IgvComponent },
  {
    path: 'tabfilemapping',
    component: TabFileMappingComponent,
    resolve: { tabFileMappings: TabFileMappingService }
  },
  {
    path: 'sampleset',
    component: SamplesetComponent,
    canActivate: [AuthenGuard],
    resolve: { samplesets: SamplesetResolver }
  },
  { path: 'sampleset/:id', component: SamplesetComponent },

  {
    path: 'configurefile',
    component: UploadConfigureComponent
    // canActivate: [AuthGuard],
  },

  {
    path: 'uploadhistory',
    component: UploadHistoryUploadcnvtoolresultComponent
  },
  {
    path: 'analysis',
    component: AnalysisComponent,
    resolve: { samplesets: ChooseSamplesetResolver }
  },
  {
    path: 'compare',
    component: CompareResultComponent
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
  providers: [AuthenGuard]
})
export class AppRoutingModule {}
