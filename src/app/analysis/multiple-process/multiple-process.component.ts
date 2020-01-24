import { MERGED_RESULT_NAME, FINAL_RESULT_NAME } from './../analysis.model';
import {
  CnvInfo,
  RegionBp,
  CnvGroup,
  IndividualSampleConfig,
  MultipleSampleConfig
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
  selector: 'app-multiple-process',
  templateUrl: './multiple-process.component.html',
  styleUrls: ['./multiple-process.component.scss']
})
export class MultipleProcessComponent implements OnInit, AfterViewInit {
  multipleConfig: MultipleSampleConfig;
  cnvTools: CnvGroup[];
  mergedTool: CnvGroup;
  selectedChrRegion: RegionBp;
  selectedCnvs: CnvInfo[];
  containerMargin: { top: number; right: number; bottom: number; left: number };

  constructor(private service: AnalysisProcessService) {}

  ngOnInit() {
    this.service.onMultipleSampleConfigChanged.subscribe(
      (config: MultipleSampleConfig) => {
        this.multipleConfig = config;
        this.service
          .getMultipleSampleData(this.multipleConfig)
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
      const length = tool.cnvGroupName.length;
      if (length > maxLength) {
        maxLength = length;
      }
    }
    maxLength = Math.max(
      maxLength,
      MERGED_RESULT_NAME.length,
      FINAL_RESULT_NAME.length
    );
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
