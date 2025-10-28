import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStoreMasterComponent } from './update-store-master.component';

describe('UpdateStoreMasterComponent', () => {
  let component: UpdateStoreMasterComponent;
  let fixture: ComponentFixture<UpdateStoreMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateStoreMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStoreMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
