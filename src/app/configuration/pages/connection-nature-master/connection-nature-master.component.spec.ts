import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionNatureMasterComponent } from './connection-nature-master.component';

describe('ConnectionNatureMasterComponent', () => {
  let component: ConnectionNatureMasterComponent;
  let fixture: ComponentFixture<ConnectionNatureMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConnectionNatureMasterComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionNatureMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
