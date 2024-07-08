import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSummaryComponent } from './booking-summary.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@ds24/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { State, actions } from './../../../../store';
import { BookingInfoComponent } from './booking-info/booking-info.component';

describe('BookingSummaryComponent', () => {
  let fixture: ComponentFixture<BookingSummaryComponent>;
  let instance: BookingSummaryComponent;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSummaryComponent, BookingInfoComponent],
      imports: [TranslateModule.forRoot(), IconModule, PipesModule, FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(BookingSummaryComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch edit booking action', () => {
    instance.editBooking();

    const action = actions.booking.editBooking();

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
