import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSimComponent } from './change-sim.component';

describe('ChangeSimComponent', () => {
  let component: ChangeSimComponent;
  let fixture: ComponentFixture<ChangeSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSimComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
