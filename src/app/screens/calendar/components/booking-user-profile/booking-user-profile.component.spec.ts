import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingUserProfileComponent } from './booking-user-profile.component';

describe('BookingUserProfileComponent', () => {
  let component: BookingUserProfileComponent;
  let fixture: ComponentFixture<BookingUserProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingUserProfileComponent],
    });
    fixture = TestBed.createComponent(BookingUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
