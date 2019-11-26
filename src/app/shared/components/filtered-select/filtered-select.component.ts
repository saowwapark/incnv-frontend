import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  OnChanges,
  Optional,
  Self,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  map
} from 'rxjs/operators';
import { filterIncluded } from 'src/app/utils/map.utils';
import {
  ControlValueAccessor,
  FormGroup,
  NgControl,
  FormBuilder
} from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-filtered-select',
  templateUrl: './filtered-select.component.html',
  styleUrls: ['./filtered-select.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: FilteredSelectComponent
    }
  ],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy'
  }
})
export class FilteredSelectComponent
  implements
    MatFormFieldControl<any>,
    ControlValueAccessor,
    OnInit,
    OnChanges,
    OnDestroy,
    AfterViewInit {
  /****************************** Logic for this component *************************/
  @Input() options: any[];
  @ViewChild('input', { static: false })
  input: ElementRef;
  filteredOptions: any[];
  selectedOption: any;

  /************************************** Property for MatFormFieldControl **********************************/
  static nextId = 0;

  filterSelectGroup: FormGroup;
  stateChanges = new Subject<void>();
  focused = false;
  errorState = false;
  controlType = 'filtered-select';
  id = `filtered-select-${FilteredSelectComponent.nextId++}`;
  describedBy = '';

  onTouched = () => {};
  get empty() {
    const {
      value: { selectControl }
    } = this.filterSelectGroup;
    return !selectControl;
  }

  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input()
  get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder: string;

  @Input()
  get required(): boolean {
    return this._required;
  }
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this._disabled
      ? this.filterSelectGroup.disable()
      : this.filterSelectGroup.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): any | null {
    const {
      value: { selectControl }
    } = this.filterSelectGroup;
    return selectControl;
  }
  set value(option: any | null) {
    this.filterSelectGroup.setValue({ selectControl: option });
    this.stateChanges.next();
  }

  /******************************** Constructor ***************************/
  constructor(
    formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.filterSelectGroup = formBuilder.group({
      selectControl: []
    });

    _focusMonitor.monitor(_elementRef, true).subscribe(origin => {
      if (this.focused && !origin) {
        this.onTouched();
      }
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'div') {
      this._elementRef.nativeElement.querySelector('div')!.focus();
    }
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /*********************** Access Form Conrol ******************/
  onChange = (_: any) => {};
  writeValue(option: any | null): void {
    this.value = option;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /********************** Life Cycle Hook ********************************/
  ngOnChanges() {
    this.filteredOptions = [...this.options];
  }
  ngOnInit() {}
  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        startWith(''),
        map(() => {
          return filterIncluded(this.input.nativeElement.value, this.options);
        })
      )
      .subscribe(filteredOptions => {
        this.filteredOptions = filteredOptions;
      });

    this.filterSelectGroup
      .get('selectControl')
      .valueChanges.subscribe(option => {
        this.onChange(option);
      });
  }
  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
