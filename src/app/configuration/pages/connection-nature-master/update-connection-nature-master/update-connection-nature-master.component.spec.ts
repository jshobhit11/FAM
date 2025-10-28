import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConnectionNatureMasterComponent } from './update-connection-nature-master.component';

describe('UpdateConnectionNatureMasterComponent', () => {
  let component: UpdateConnectionNatureMasterComponent;
  let fixture: ComponentFixture<UpdateConnectionNatureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateConnectionNatureMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConnectionNatureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
