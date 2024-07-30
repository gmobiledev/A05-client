import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GipComponent } from './gip.component';

describe('GipComponent', () => {
  let component: GipComponent;
  let fixture: ComponentFixture<GipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
