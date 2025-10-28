import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConnectionNatureMasterComponent } from './add-connection-nature-master.component';

describe('AddConnectionNatureMasterComponent', () => {
  let component: AddConnectionNatureMasterComponent;
  let fixture: ComponentFixture<AddConnectionNatureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddConnectionNatureMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConnectionNatureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
