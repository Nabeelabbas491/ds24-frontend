import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@ds24/elements';
import { BookingTypeSelectionComponent } from '../booking-type-selection/booking-type-selection.component';
import { TimeSelectionComponent } from '../time-selection/time-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions, selectors } from '../../../../store';
import { MemoizedSelector } from '@ngrx/store';
import { BookingSelectionStepComponent } from './booking-selection-step.component';
import { MeetingType } from './../../../../types/misc.type';

describe('BookingSelectionStepComponent', () => {
  let fixture: ComponentFixture<BookingSelectionStepComponent>;
  let instance: BookingSelectionStepComponent;
  let mockStore: MockStore<State>;

  let isBookingSelectionStepComplete: MemoizedSelector<State, boolean>;
  let meetingType: MemoizedSelector<State, MeetingType | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSelectionStepComponent, BookingTypeSelectionComponent, TimeSelectionComponent],
      imports: [TranslateModule.forRoot(), IconModule, FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(BookingSelectionStepComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    isBookingSelectionStepComplete = mockStore.overrideSelector(
      selectors.booking.isBookingSelectionStepComplete,
      false,
    );
    meetingType = mockStore.overrideSelector(selectors.booking.selectMeetingType, {
      id: 2,
      name: 'Outbound Phone Call',
    });

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('isBookingSelectionSepComplete should be set to true', () => {
    isBookingSelectionStepComplete.setResult(true);
    mockStore.refreshState();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should demonstrate bookingType change ', () => {
    meetingType.setResult({ id: 1, name: 'Inbound Phone Call' });
    mockStore.refreshState();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch next step action', () => {
    instance.nextStep();

    const action = actions.booking.selectStep({ step: 'booking_form' });

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
