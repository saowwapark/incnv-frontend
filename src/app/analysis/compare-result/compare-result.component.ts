import { Component, OnInit } from '@angular/core';

import { Observable, of } from 'rxjs';
import { CoreShapeComponent } from 'ng2-konva';
import Konva from 'konva';

@Component({
  selector: 'app-compare-result',
  templateUrl: './compare-result.component.html',
  styleUrls: ['./compare-result.component.scss']
})
export class CompareResultComponent implements OnInit {
  public configStage: Observable<any> = of({
    width: 200,
    height: 200
  });
  public configCircle1: Observable<any> = of({
    x: 100,
    y: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  public configCircle2: Observable<any> = of({
    x: 200,
    y: 200,
    radius: 70,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4
  });

  public handleClick(component: CoreShapeComponent) {
    console.log('Hello Circle', component);
  }

  public handleMouseover(component: CoreShapeComponent) {
    console.log('Hello Circle', component);
  }

  ngOnInit() {}
  // ngOnInit() {
  //   let stage = new Konva.Stage({
  //     container: 'container',
  //     width: window.innerWidth,
  //     height: window.innerHeight
  //   });

  //   let triangle = new Konva.RegularPolygon({
  //     x: 80,
  //     y: 120,
  //     sides: 3,
  //     radius: 80,
  //     fill: '#00D2FF',
  //     stroke: 'black',
  //     strokeWidth: 4
  //   });
  //   triangle.on('mousemove', function() {
  //     const mousePos = stage.getPointerPosition();
  //     const x = mousePos.x - 190;
  //     const y = mousePos.y - 40;
  //     console.log(`x: ${x}, y: ${y}`);
  //     // writeMessage('x: ' + x + ', y: ' + y);
  //   });
  // }
}
