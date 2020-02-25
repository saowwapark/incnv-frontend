import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-file-reformat-cnv-tool-result',
  templateUrl: './my-file-reformat-cnv-tool-result.component.html',
  styleUrls: ['./my-file-reformat-cnv-tool-result.component.scss']
})
export class MyFileReformatCnvToolResultComponent implements OnInit {
  uploadCnvToolResultId: number;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.uploadCnvToolResultId = +this.route.snapshot.paramMap.get('id');
  }
}
