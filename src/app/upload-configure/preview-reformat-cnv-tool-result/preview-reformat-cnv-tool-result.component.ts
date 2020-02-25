import {
  Component,
  OnInit,
  OnDestroy,
  ViewEncapsulation,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-preview-reformat-cnv-tool-result',
  templateUrl: './preview-reformat-cnv-tool-result.component.html',
  styleUrls: ['./preview-reformat-cnv-tool-result.component.scss']
})
export class PreviewReformatCnvToolResultComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() uploadCnvToolResultId: number;

  @Output()
  previousStep = new EventEmitter<any>();
  @Output() nextStep = new EventEmitter<any>();

  private _unsubscribeAll: Subject<any>;

  constructor() {
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  ngOnInit(): void {}

  ngAfterViewInit() {}
  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * New Sampleset
   */

  goToPreviousStep() {
    this.previousStep.next();
  }

  goToNextStep() {
    this.nextStep.next();
  }
}
