import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionTypeMasterComponent } from './connection-type-master.component';

describe('ConnectionTypeMasterComponent', () => {
  let component: ConnectionTypeMasterComponent;
  let fixture: ComponentFixture<ConnectionTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionTypeMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
