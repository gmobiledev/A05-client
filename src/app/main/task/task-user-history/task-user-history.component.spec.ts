import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskUserHistoryComponent } from './task-user-history.component';

describe('TaskUserHistoryComponent', () => {
  let component: TaskUserHistoryComponent;
  let fixture: ComponentFixture<TaskUserHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskUserHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskUserHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
