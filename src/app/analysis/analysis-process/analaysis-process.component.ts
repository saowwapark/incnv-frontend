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
      });
  }

  selectRegionBp(selectedRegion: {
    regionStartBp: number;
    regionEndBp: number;
  }) {
    this.regionStartBp = selectedRegion.regionStartBp;
    this.regionEndBp = selectedRegion.regionEndBp;
  }

  ngAfterViewInit(): void {}
}
