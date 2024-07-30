import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceOtpComponent } from './voice-otp.component';

describe('VoiceOtpComponent', () => {
  let component: VoiceOtpComponent;
  let fixture: ComponentFixture<VoiceOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceOtpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
