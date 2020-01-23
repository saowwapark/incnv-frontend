import {
  CnvInfo,
  RegionBp,
  CnvTool,
  IndividualSampleConfig
} from '../analysis.model';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

import {
  chosenReferenceGenome,
  chosenSampleset,
  chosenSample,
  chosenFiles,
  chosenCnvType,
  chosenChr
} from '../mock-data';
import { AnalysisProcessService } from '../shared/analysis-process/analysis-process.service';

@Component({
  selector: 'app-individual-process',
  templateUrl: './individual-process.component.html',
  styleUrls: ['./individual-process.component.scss']
})
export class IndividualProcessComponent implements OnInit, AfterViewInit {
  individualConfig: IndividualSampleConfig;
  cnvTools: CnvTool[];
  mergedTool: CnvTool;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfo[];
  containerMargin: { top: number; right: number; bottom: number; left: number };

  constructor(private service: AnalysisProcessService) {}

  ngOnInit() {
    // // mock data
    //  this.individualConfig.referenceGenome = chosenReferenceGenome;
    //  this.individualConfig.samplesetName =
    //    chosenSampleset.samplesetName;
    //  this.individualConfig.sample = chosenSample;
    //  this.individualConfig.uploadCnvToolResults = chosenFiles;
    //  this.individualConfig.cnvType = chosenCnvType;
    //  this.individualConfig.chromosome = chosenChr;

    this.service.onIndividualConfigChanged.subscribe(
      (config: IndividualSampleConfig) => {
        this.individualConfig = config;
        this.service
          .getIndividualData(this.individualConfig)
          .subscribe(data => {
            this.cnvTools = data[0];
            this.mergedTool = data[1];
            this.containerMargin = this.calContainerMargin();
          });
      }
    );
  }

  selectChrRegion(selectedChrRegion: RegionBp) {
    this.selectedChrRegion = selectedChrRegion;
  }

  selectCnvs(selectedCnvs: CnvInfo[]) {
    this.selectedCnvs = [...selectedCnvs];
  }

  exportCnvInfos() {
    this.service.downloadCnvInfos(this.selectedCnvs).subscribe(() => {
      console.log('export success');
    });
  }
  private calContainerMargin() {
    // max character lenght
    let maxLength = 0;
    for (const tool of this.cnvTools) {
      const length = tool.cnvToolId.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    // create margins and dimensions
    const containerMargin = {
      top: 40,
      right: 40,
      bottom: 30,
      left: 10 + 6 * maxLength
    };
    return containerMargin;
  }

  ngAfterViewInit(): void {}
}
