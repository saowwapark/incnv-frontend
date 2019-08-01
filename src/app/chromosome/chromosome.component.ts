import { Component, OnInit } from '@angular/core';
// import Ideogram

declare var Ideogram: any;
@Component({
  selector: 'app-chromosome',
  templateUrl: './chromosome.component.html',
  styleUrls: ['./chromosome.component.scss']
})
export class ChromosomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    this.createIdeogram();
  }

  createIdeogram() {
    const config = {
      container: '#container',
      orientation: 'vertical',
      organism: 'human',
      assembly: 'GRCh37',
      chrHeight: 275,
      annotationsPath: 'assets/static/data/annotations/SRR562646.json',
      annotationsLayout: 'histogram',
      barWidth: 3,
      filterable: true
    };

   //  const ideogram = new Ideogram(config);


  }
}
