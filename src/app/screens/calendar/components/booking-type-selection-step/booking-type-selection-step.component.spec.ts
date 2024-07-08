import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { DsFormsModule, IconModule } from '@ds24/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from '../../../../store';
import { BookingTypeSelectionStepComponent } from './booking-type-selection-step.component';
import { BookingTypeSelectionComponent } from '../booking-type-selection/booking-type-selection.component';

describe('BookingTypeSelectionStep', () => {
  let fixture: ComponentFixture<BookingTypeSelectionStepComponent>;
  let instance: BookingTypeSelectionStepComponent;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTypeSelectionStepComponent, BookingTypeSelectionComponent],
      imports: [TranslateModule.forRoot(), IconModule, DsFormsModule, FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(BookingTypeSelectionStepComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should dispatch prev step action', () => {
    instance.prevStep();

    const action = actions.booking.selectStep({ step: 'calendar' });

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
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
