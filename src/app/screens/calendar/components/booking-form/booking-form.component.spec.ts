import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BookingFormComponent } from './booking-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { DsFormsModule, IconModule } from '@ds24/elements';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { State, actions, selectors } from './../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';

describe('BookingFormComponent', () => {
  let fixture: ComponentFixture<BookingFormComponent>;
  let instance: BookingFormComponent;
  let mockStore: MockStore<State>;
  let selectBookingError: MemoizedSelector<State, string | null>;
  let selectBookingPending: MemoizedSelector<State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), IconModule, PipesModule, DsFormsModule, FormsModule, ReactiveFormsModule],
      declarations: [BookingFormComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore({
          selectors: [{ selector: selectors.booking.selectMeetingType, value: { id: 2, name: 'Outbound Phone Call' } }],
        }),
      ],
    });
    fixture = TestBed.createComponent(BookingFormComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    selectBookingError = mockStore.overrideSelector(selectors.bookingAPI.selectBookingSaveError, null);
    selectBookingPending = mockStore.overrideSelector(selectors.bookingAPI.selectBookingSavePending, false);

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should compile', () => {
    fixture.componentInstance.ngOnInit();
    expect(fixture).toMatchSnapshot();
  });

  it('should disable the form if pending', () => {
    selectBookingPending.setResult(true);
    mockStore.refreshState();
    fixture.componentInstance.ngOnInit();

    expect(fixture).toMatchSnapshot();
  });

  it('should display an error message if provided', () => {
    selectBookingError.setResult('Invalid ');
    mockStore.refreshState();
    fixture.componentInstance.ngOnInit();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch an action if the form is valid when submitted', () => {
    const bookingDetail = {
      name: 'Test User',
      email: 'test@test.com',
      phoneNo: '+123456',
      note: 'test test',
    };

    instance.form.setValue(bookingDetail);

    instance.confirmBooking();

    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.bookingAPI.saveBooking({ bookingDetail }));
  });

  it('should not dispatch an action if the form is invalid when submitted', () => {
    const bookingDetail = {
      name: '',
      email: 'test@test.com',
      phoneNo: '123-456',
      note: 'test test',
    };

    instance.form.setValue(bookingDetail);

    instance.confirmBooking();

    expect(mockStore.dispatch).toBeCalledTimes(0);
  });
  it('should dispatch prev step action', () => {
    instance.prevStep();

    const action = actions.booking.selectStep({ step: 'booking_type' });

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });
  it('should listen to valueChanges and update leftCountName$', (done: any) => {
    fixture.componentInstance.ngOnInit();
    const name = 'Test Name';
    instance.form.get('name')?.setValue(name);
    instance.leftCountName$.subscribe(value => {
      expect(value).toBe(Math.max(0, 80 - name.length));
      done();
    });
  });

  it('should listen to valueChanges and update leftCountComments$', (done: any) => {
    fixture.componentInstance.ngOnInit();
    const testComments = 'Test Comments';
    instance.form.get('note')?.setValue(testComments);
    instance.leftCountComments$.subscribe(value => {
      expect(value).toBe(Math.max(0, 300 - testComments.length));
      done();
    });
  });

  it('if meetingType is outbound, validations are applied on phoneNumber', (done: any) => {
    fixture.componentInstance.ngOnInit();
    instance.meetingType$.subscribe(() => {
      expect(instance.form.get('phoneNo')?.hasValidator(Validators.required)).toBe(true);
      done();
    });
  });
  it('if meetingType is outbound, make sure pattern validation is working on phone number', (done: any) => {
    fixture.componentInstance.ngOnInit();
    instance.meetingType$.subscribe(() => {
      const bookingDetail = {
        name: 'test user',
        email: 'test@test.com',
        phoneNo: 'abc',
        note: 'test test',
      };

      instance.form.setValue(bookingDetail);

      instance.confirmBooking();

      expect(mockStore.dispatch).toBeCalledTimes(0);
      done();
    });
  });
});
