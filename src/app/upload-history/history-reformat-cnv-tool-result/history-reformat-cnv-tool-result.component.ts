import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-history-reformat-cnv-tool-result',
  templateUrl: './history-reformat-cnv-tool-result.component.html',
  styleUrls: ['./history-reformat-cnv-tool-result.component.scss']
})
export class HistoryReformatCnvToolResultComponent implements OnInit {
  cnvToolResultId: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // this.cnvToolResultId = +this.route.snapshot.paramMap.get('id');
  }
}
