import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConnectionTypeMasterComponent } from './update-connection-type-master.component';

describe('UpdateConnectionTypeMasterComponent', () => {
  let component: UpdateConnectionTypeMasterComponent;
  let fixture: ComponentFixture<UpdateConnectionTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateConnectionTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConnectionTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
