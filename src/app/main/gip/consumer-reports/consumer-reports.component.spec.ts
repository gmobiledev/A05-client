import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerReportsComponent } from './consumer-reports.component';

describe('ConsumerReportsComponent', () => {
  let component: ConsumerReportsComponent;
  let fixture: ComponentFixture<ConsumerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsumerReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
