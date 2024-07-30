import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsOtpComponent } from './sms-otp.component';

describe('SmsOtpComponent', () => {
  let component: SmsOtpComponent;
  let fixture: ComponentFixture<SmsOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmsOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
