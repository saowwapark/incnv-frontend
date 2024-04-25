import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppPageComponent } from './pages/app-page/app-page.component';

import { AuthenGuard } from './authen/authen.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RefreshGuard } from './shared/guards/refresh.guard';
import { DatasourceComponent } from './datasource/datasource.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeContentComponent } from './pages/home-page/home-content/home-content.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { 
    path: 'home',
    component: HomePageComponent,
    children: [
      { path: '', component: HomeContentComponent }
    ]
  }, 
  {
    path: '',
    component: AppPageComponent,
    // canActivate: [AuthenGuard],
    
    children: [
      { path: 'install', component: DatasourceComponent },
      {
        path: 'upload-cnvs',
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
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthenGuard]
})
export class AppRoutingModule {}
