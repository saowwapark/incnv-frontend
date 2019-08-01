import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeMenuComponent } from './welcome-menu.component';

describe('WelcomeMenuComponent', () => {
  let component: WelcomeMenuComponent;
  let fixture: ComponentFixture<WelcomeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
