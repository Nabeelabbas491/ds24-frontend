import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentCalendarComponent } from './appointment-calendar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { State, actions } from '../../../../store';
import { MatMenuModule } from '@angular/material/menu';
import { EventData } from 'src/app/types/vendor.types';
import { MeetingTypeId } from '../../../../types/booking.type';

describe('AppointmentCalendarComponent', () => {
  let component: AppointmentCalendarComponent;
  let fixture: ComponentFixture<AppointmentCalendarComponent>;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, TranslateModule.forRoot(), MatMenuModule],
      declarations: [AppointmentCalendarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(AppointmentCalendarComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to details page when showDetailsPage is called', () => {
    fixture.detectChanges();
    const detailsId = 5;
    component.showDetailsPage(detailsId);
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorAppointment.redirectToVendorDetailPage({ detailsId }),
    );
  });

  it('should return the day number when the date is passed to the method', () => {
    const mockDate = new Date('November 22 2023');

    const dayofWeekSpy = jest.spyOn(component, 'getDayOfWeek');

    const dayOfWeek = component.getDayOfWeek(mockDate);

    expect(dayofWeekSpy).toHaveBeenCalledWith(mockDate);
    expect(dayOfWeek).toBe(3);
  });

  it('should call the actions when getNextMonth() function is called', () => {
    component.getNextMonth();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendorCalendar.getNextMonth());
  });

  it('should call the actions when getPrevMonth() function is called', () => {
    component.getPrevMonth();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendorCalendar.getPrevMonth());
  });

  it('should set the passed data in selectedEventData', () => {
    const selectedEventData: EventData[] = [
      {
        appointmentTime: '14:00 Full Name',
        appointmentId: 1,
        appointmentType: MeetingTypeId.Inbound,
        appointmentStatus: 'scheduled',
      },
      {
        appointmentTime: '14:00 Full Name',
        appointmentId: 2,
        appointmentType: MeetingTypeId.Outbound,
        appointmentStatus: 'scheduled',
      },
      {
        appointmentTime: '14:00 Full Name',
        appointmentId: 3,
        appointmentType: MeetingTypeId.Inbound,
        appointmentStatus: 'scheduled',
      },
    ];

    component.setSelectedEventData(selectedEventData);
    expect(component.selectedEventData).toBe(selectedEventData);
  });
});
