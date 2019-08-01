import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentUploadFilesComponent } from './recent-upload-files.component';

describe('RecentUploadFilesComponent', () => {
  let component: RecentUploadFilesComponent;
  let fixture: ComponentFixture<RecentUploadFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentUploadFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentUploadFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
