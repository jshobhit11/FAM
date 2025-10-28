import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEstimateTemplateMasterComponent } from './update-estimate-template-master.component';

describe('UpdateEstimateTemplateMasterComponent', () => {
  let component: UpdateEstimateTemplateMasterComponent;
  let fixture: ComponentFixture<UpdateEstimateTemplateMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEstimateTemplateMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateEstimateTemplateMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
