import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadWorkCompletionComponent } from './download-work-completion.component';

describe('DownloadWorkCompletionComponent', () => {
  let component: DownloadWorkCompletionComponent;
  let fixture: ComponentFixture<DownloadWorkCompletionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DownloadWorkCompletionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadWorkCompletionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
