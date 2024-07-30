import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGipComponent } from './list-gip.component';

describe('ListGipComponent', () => {
  let component: ListGipComponent;
  let fixture: ComponentFixture<ListGipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListGipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
