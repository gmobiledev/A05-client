import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimSoComponent } from './sim-so.component';

describe('SimSoComponent', () => {
  let component: SimSoComponent;
  let fixture: ComponentFixture<SimSoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimSoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
