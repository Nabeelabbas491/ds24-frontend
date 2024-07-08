import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@ds24/elements';
import { TimeSelectionComponent } from '../time-selection/time-selection.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions, selectors } from '../../../../store';
import { MemoizedSelector } from '@ngrx/store';
import { DateTimeSelectionStepComponent } from './date-time-selection-step.component';

describe('DateTimeSelectionStep', () => {
  let fixture: ComponentFixture<DateTimeSelectionStepComponent>;
  let instance: DateTimeSelectionStepComponent;
  let mockStore: MockStore<State>;

  let isDateTimeSelectionStepComplete: MemoizedSelector<State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateTimeSelectionStepComponent, TimeSelectionComponent],
      imports: [TranslateModule.forRoot(), IconModule, FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(DateTimeSelectionStepComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    isDateTimeSelectionStepComplete = mockStore.overrideSelector(
      selectors.booking.isDateTimeSelectionStepComplete,
      false,
    );

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('isBookingSelectionSepComplete should be set to true', () => {
    isDateTimeSelectionStepComplete.setResult(true);
    mockStore.refreshState();
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch next step action', () => {
    instance.nextStep();

    const action = actions.booking.selectStep({ step: 'booking_type' });

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
