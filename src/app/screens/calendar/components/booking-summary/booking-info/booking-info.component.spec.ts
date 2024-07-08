import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingInfoComponent } from './booking-info.component';

describe('BookingInfoComponent', () => {
  let component: BookingInfoComponent;
  let fixture: ComponentFixture<BookingInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingInfoComponent],
    });
    fixture = TestBed.createComponent(BookingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
