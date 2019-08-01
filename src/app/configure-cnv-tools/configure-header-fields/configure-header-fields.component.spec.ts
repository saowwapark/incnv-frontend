import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureHeaderFieldsComponent } from './configure-header-fields.component';

describe('ConfigureHeaderFieldsComponent', () => {
  let component: ConfigureHeaderFieldsComponent;
  let fixture: ComponentFixture<ConfigureHeaderFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigureHeaderFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureHeaderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
