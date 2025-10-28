import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateProcessTypeMasterComponent } from './update-process-type-master.component';

describe('UpdateProcessTypeMasterComponent', () => {
  let component: UpdateProcessTypeMasterComponent;
  let fixture: ComponentFixture<UpdateProcessTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateProcessTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateProcessTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
