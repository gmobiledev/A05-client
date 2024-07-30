import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrganirationComponent } from './form-organiration.component';

describe('FormOrganirationComponent', () => {
  let component: FormOrganirationComponent;
  let fixture: ComponentFixture<FormOrganirationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOrganirationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOrganirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
