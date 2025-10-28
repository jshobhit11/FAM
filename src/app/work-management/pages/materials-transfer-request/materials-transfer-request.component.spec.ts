import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsTransferRequestComponent } from './materials-transfer-request.component';

describe('MaterialsTransferRequestComponent', () => {
  let component: MaterialsTransferRequestComponent;
  let fixture: ComponentFixture<MaterialsTransferRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsTransferRequestComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialsTransferRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
