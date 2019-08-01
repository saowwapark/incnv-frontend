import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadComponent } from './configure-cnv-tools/upload/upload.component';
import { ConfigureHeaderFieldsComponent } from './configure-cnv-tools/configure-header-fields/configure-header-fields.component';
import { ActivitiesComponent } from './activities/activities.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './auth/login/login.component';
import { ConfigureCNVtoolsComponent } from './configure-cnv-tools/configure-cnv-tools.component';
import { ChromosomeComponent } from './chromosome/chromosome.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SampleSetComponent } from './sampleset/sampleset.component';
import { ChooseFilesComponent } from './analysis/choose-files/choose-files.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './auth/auth.guard';
import { UploadsService } from './configure-cnv-tools/upload/uploads.service';

const appRoutes: Routes = [
  // level1
  { path: '', component: HomeComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'configurecnvtools', component: ConfigureCNVtoolsComponent },
  { path: 'configureheaderfields', component: ConfigureHeaderFieldsComponent },
  { path: 'analysis', redirectTo: 'choosefiles' },
  { path: 'choosefiles', component: ChooseFilesComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'chromosome', component: ChromosomeComponent },
  { path: 'sampleset', component: SampleSetComponent },
  { path: 'sampleset/:id', component: SampleSetComponent },
  {
    path: 'upload',
    component: UploadComponent,
    canActivate: [AuthGuard],
    resolve: { uploads: UploadsService }
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
