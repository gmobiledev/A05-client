import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBehalfWalletComponent } from './payment-behalf-wallet.component';

describe('PaymentBehalfWalletComponent', () => {
  let component: PaymentBehalfWalletComponent;
  let fixture: ComponentFixture<PaymentBehalfWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentBehalfWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentBehalfWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
