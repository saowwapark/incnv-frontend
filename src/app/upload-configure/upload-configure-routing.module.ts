import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadConfigureComponent } from './upload-configure.component';

const routes: Routes = [
  {
    path: '',
    component: UploadConfigureComponent
    // canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadConfigureRoutingModule {}
