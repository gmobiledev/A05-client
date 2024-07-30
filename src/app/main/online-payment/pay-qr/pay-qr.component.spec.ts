import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayQRComponent } from './pay-qr.component';

describe('PayQRComponent', () => {
  let component: PayQRComponent;
  let fixture: ComponentFixture<PayQRComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayQRComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayQRComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
