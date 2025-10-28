import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAreaSpecificLoadingComponent } from './update-area-specific-loading.component';

describe('UpdateAreaSpecificLoadingComponent', () => {
  let component: UpdateAreaSpecificLoadingComponent;
  let fixture: ComponentFixture<UpdateAreaSpecificLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAreaSpecificLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateAreaSpecificLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
