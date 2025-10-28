import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformerUploadComponent } from './transformer-upload.component';

describe('TransformerUploadComponent', () => {
  let component: TransformerUploadComponent;
  let fixture: ComponentFixture<TransformerUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransformerUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransformerUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
