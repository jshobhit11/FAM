import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTypeMasterComponent } from './process-type-master.component';

describe('ProcessTypeMasterComponent', () => {
  let component: ProcessTypeMasterComponent;
  let fixture: ComponentFixture<ProcessTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
