import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaSpecificLoadingMasterComponent } from './area-specific-loading-master.component';

describe('AreaSpecificLoadingMasterComponent', () => {
  let component: AreaSpecificLoadingMasterComponent;
  let fixture: ComponentFixture<AreaSpecificLoadingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreaSpecificLoadingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreaSpecificLoadingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
