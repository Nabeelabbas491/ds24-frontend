import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, selectors } from './../../../store';
import { MemoizedSelector } from '@ngrx/store';
import { CalendarPageComponent } from './calendar-page.component';
import { BookingTypeSelectionComponent } from './booking-type-selection/booking-type-selection.component';
import { TimeSelectionComponent } from './time-selection/time-selection.component';
import { BookingFormComponent } from './booking-form/booking-form.component';
import { BookingSummaryComponent } from './booking-summary/booking-summary.component';
import { BookingStep } from './../../../types/booking.type';
import { DateFormatPipe } from './../../../shared/pipes/date-format.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingSelectionStepComponent } from './booking-selection-step/booking-selection-step.component';
import { BookingSummaryStepComponent } from './booking-summary-step/booking-summary-step.component';
import { BookingConfirmationStepComponent } from './booking-confirmation-step/booking-confirmation-step.component';
import { TimeSlotPipe } from './../../../shared/pipes/time-slot.pipe';

describe('Step1Component', () => {
  let fixture: ComponentFixture<CalendarPageComponent>;
  let instance: CalendarPageComponent;
  let mockStore: MockStore<State>;

  let currentStep: MemoizedSelector<State, BookingStep>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarPageComponent,
        BookingSelectionStepComponent,
        BookingTypeSelectionComponent,
        TimeSelectionComponent,
        BookingSummaryStepComponent,
        BookingFormComponent,
        BookingSummaryComponent,
        BookingConfirmationStepComponent,
        BookingConfirmationComponent,
        DateFormatPipe,
        TimeSlotPipe,
      ],
      imports: [TranslateModule.forRoot(), FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(CalendarPageComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    currentStep = mockStore.overrideSelector(selectors.booking.selectCurrentStep, 'calendar');

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should demonstrate bookingType change', () => {
    currentStep.setResult('booking_form');
    mockStore.refreshState();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
