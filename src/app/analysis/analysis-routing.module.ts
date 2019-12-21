import { AnalysisProcessComponent } from './analysis-process/anlaysis-process.component';
import { ChooseSamplesetResolver } from './analysis-configure/choose-sampleset/choose-sampleset.resolver';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AnalysisConfigureComponent } from './analysis-configure/analysis-configure.component';
import { CompareResultComponent } from './analysis-configure/compare-result/compare-result.component';

const routes: Routes = [
  {
    path: 'analysis',
    component: AnalysisConfigureComponent,
    resolve: { samplesets: ChooseSamplesetResolver }
  },
  {
    path: 'analysis/process',
    component: AnalysisProcessComponent
  },
  {
    path: 'compare',
    component: CompareResultComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalysisRoutingModule {}
