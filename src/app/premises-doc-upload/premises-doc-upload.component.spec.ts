import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremisesDocUploadComponent } from './premises-doc-upload.component';

describe('PremisesDocUploadComponent', () => {
  let component: PremisesDocUploadComponent;
  let fixture: ComponentFixture<PremisesDocUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremisesDocUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremisesDocUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
