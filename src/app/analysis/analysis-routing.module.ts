import { AnalysisProcessComponent } from './analysis-process/analaysis-process.component';
import { ChooseSamplesetResolver } from './analysis-configure/choose-sampleset/choose-sampleset.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AnalysisConfigureComponent } from './analysis-configure/analysis-configure.component';

const routes: Routes = [
  {
    path: 'analysis',
    component: AnalysisConfigureComponent,
    resolve: { samplesets: ChooseSamplesetResolver }
  },
  {
    path: 'analysis/analysis-process',
    component: AnalysisProcessComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule {}
