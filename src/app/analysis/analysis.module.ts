import { AnalysisComponent } from './analysis.component';
import { MergedResultTableComponent } from './analysis-process/merged-result-table/merged-result-table.component';
import { AnalysisProcessComponent } from './analysis-process/analaysis-process.component';
import { CnvToolChartComponent } from './analysis-process/cnv-tool-chart/cnv-tool-chart.component';
import { ChooseSamplesetResolver } from './analysis-configure/choose-sampleset/choose-sampleset.resolver';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';
import { AnalysisConfigureComponent } from './analysis-configure/analysis-configure.component';
import { ChooseSamplesetComponent } from './analysis-configure/choose-sampleset/choose-sampleset.component';
import { ChooseSampleComponent } from './analysis-configure/choose-sample/choose-sample.component';
import { ChooseFileComponent } from './analysis-configure/choose-file/choose-file.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisConfigureComponent,
    ChooseSamplesetComponent,
    ChooseSampleComponent,
    ChooseFileComponent,
    AnalysisProcessComponent,
    CnvToolChartComponent,
    MergedResultTableComponent
  ],
  imports: [SharedModule, AnalysisRoutingModule],
  providers: [ChooseSamplesetResolver]
})
export class AnalysisModule {}
