import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationTypeMasterComponent } from './application-type-master.component';

describe('ApplicationTypeMasterComponent', () => {
  let component: ApplicationTypeMasterComponent;
  let fixture: ComponentFixture<ApplicationTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApplicationTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
