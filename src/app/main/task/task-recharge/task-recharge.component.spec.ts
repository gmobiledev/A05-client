import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskRechargeComponent } from './task-recharge.component';

describe('TaskRechargeComponent', () => {
  let component: TaskRechargeComponent;
  let fixture: ComponentFixture<TaskRechargeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskRechargeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskRechargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
