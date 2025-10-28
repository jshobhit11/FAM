import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateApplicationTypeMasterComponent } from './update-application-type-master.component';

describe('UpdateApplicationTypeMasterComponent', () => {
  let component: UpdateApplicationTypeMasterComponent;
  let fixture: ComponentFixture<UpdateApplicationTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateApplicationTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateApplicationTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
