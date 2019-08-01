import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFilesComponent } from './export-files.component';

describe('ExportFilesComponent', () => {
  let component: ExportFilesComponent;
  let fixture: ComponentFixture<ExportFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
