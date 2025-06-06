import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProductComponent } from './task-product.component';

describe('TaskProductComponent', () => {
  let component: TaskProductComponent;
  let fixture: ComponentFixture<TaskProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
