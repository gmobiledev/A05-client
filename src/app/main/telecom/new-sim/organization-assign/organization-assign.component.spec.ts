import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationAssignComponent } from './organization-assign.component';

describe('OrganizationAssignComponent', () => {
  let component: OrganizationAssignComponent;
  let fixture: ComponentFixture<OrganizationAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationAssignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
