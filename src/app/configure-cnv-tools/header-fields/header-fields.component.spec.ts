import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFieldsComponent } from './header-fields.component';

describe('HeaderFieldsComponent', () => {
  let component: HeaderFieldsComponent;
  let fixture: ComponentFixture<HeaderFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
