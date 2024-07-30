import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TelecomTaskComponent } from './telecom-task.component';

describe('TelecomTaskComponent', () => {
  let component: TelecomTaskComponent;
  let fixture: ComponentFixture<TelecomTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TelecomTaskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TelecomTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
