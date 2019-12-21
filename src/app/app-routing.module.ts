import { LayoutComponent } from './layout/layout.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';

import { AuthenGuard } from './authen/authen.guard';
import { HomeContentComponent } from './home/home-content/home-content.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  // level1
  { path: '', component: HomeContentComponent },

  { path: 'welcome', component: WelcomeComponent },
  {
    path: 'configurefile',
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
    path: 'layout',
    component: LayoutComponent
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { enableTracing: false })],
  exports: [RouterModule]
  // providers: [AuthenGuard]
})
export class AppRoutingModule {}
