import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitNodeComponent } from './unit-node.component';

describe('UnitNodeComponent', () => {
  let component: UnitNodeComponent;
  let fixture: ComponentFixture<UnitNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
