import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationDocComponent } from './organization-doc.component';

describe('OrganizationDocComponent', () => {
  let component: OrganizationDocComponent;
  let fixture: ComponentFixture<OrganizationDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrganizationDocComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
