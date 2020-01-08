import { CnvFragmentAnnotation } from './../analysis.model';
import { AnalysisProcessService } from './analysis-process.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Sampleset } from 'src/app/sampleset/sampleset.model';
import { UploadCnvToolResult } from 'src/app/shared/models/upload-cnv-tool-result.model';

import {
  chosenReferenceGenome,
  chosenSampleset,
  chosenSample,
  chosenFiles,
  chosenCnvType,
  chosenChr
} from '../mock-data';

@Component({
  selector: 'app-analysis-process',
  templateUrl: './analysis-process.component.html',
  styleUrls: ['./analysis-process.component.scss']
})
export class AnalysisProcessComponent implements OnInit, AfterViewInit {
  @Input() chosenReferenceGenome: string;
  @Input() chosenSampleset: Sampleset;
  @Input() chosenSample: string;
  @Input() chosenFiles: UploadCnvToolResult[];
  @Input() chosenCnvType: string;
  @Input() chosenChr: string;

  cnvTools;
  regionStartBp: number;
  regionEndBp: number;
  selectedCnvs: CnvFragmentAnnotation[];
  containerMargin: { top: number; right: number; bottom: number; left: number };

  constructor(private analyisService: AnalysisProcessService) {
    // mock data
    this.chosenReferenceGenome = chosenReferenceGenome;
    this.chosenSampleset = chosenSampleset;
    this.chosenSample = chosenSample;
    this.chosenFiles = chosenFiles;
    this.chosenCnvType = chosenCnvType;
    this.chosenChr = chosenChr;
  }

  ngOnInit() {
    this.analyisService
      .getAllCnvToolDetails(
        this.chosenReferenceGenome,
        this.chosenFiles,
        this.chosenSample,
        this.chosenChr,
        this.chosenCnvType
      )
      .subscribe(data => {
        this.cnvTools = data;
        this.containerMargin = this.calContainerMargin();
      });
  }

  selectRegionBp(selectedRegion: {
    regionStartBp: number;
    regionEndBp: number;
  }) {
    this.regionStartBp = selectedRegion.regionStartBp;
    this.regionEndBp = selectedRegion.regionEndBp;
  }

  selectCnvs(selectedCnvs: CnvFragmentAnnotation[]) {
    this.selectedCnvs = [...selectedCnvs];
  }

  private calContainerMargin() {
    // max character lenght
    let maxLength = 0;
    for (const tool of this.cnvTools) {
      const length = tool.cnvToolIdentity.length;
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
