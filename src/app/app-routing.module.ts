import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome-template/welcome-template.component';

import { AuthenGuard } from './authen/authen.guard';
import { HomeContentComponent } from './home-template/home-content/home-content.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RefreshGuard } from './shared/guards/refresh.guard';

const appRoutes: Routes = [
  // level1
  {
    path: '',
    // canActivate: [AuthenGuard],

    children: [
      {
        path: 'upload-cnv-result',
        loadChildren: () =>
          import('./upload-configure/upload-configure.module').then(
            module => module.UploadConfigureModule
          )
      },
      {
        path: 'sampleset',
        loadChildren: () =>
          import('./sampleset/sampleset.module').then(
            module => module.SamplesetModule
          )
      },
      {
        path: 'tabfilemapping',
        loadChildren: () =>
          import('./tab-file-mapping/tab-file-mapping.module').then(
            module => module.TabFileMappingModule
          )
      },
      {
        path: 'analysis',
        loadChildren: () =>
          import('./analysis/analysis.module').then(
            module => module.AnalysisModule
          )
      }
    ]
  },
  { path: 'welcome-template', component: WelcomeComponent },
  { path: 'home', component: HomeContentComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthenGuard]
})
export class AppRoutingModule {}
