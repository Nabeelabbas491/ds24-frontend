import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actions from '../../../../store/actions';
import { ReactiveLifecycles } from '@ds24/utilities';
import { getDay, startOfToday } from 'date-fns';
import { CalendarWeekDays, ColStartClasses } from '../../../../shared/common/util';
import { selectors } from '../../../../store';
import { IconColor, IconName } from '@ds24/elements';
import { AppointmentStatus, EventData } from '../../../../types/vendor.types';
import { MeetingTypeId } from '../../../../types/booking.type';

@Component({
  selector: 'ds-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
})
export class AppointmentCalendarComponent extends ReactiveLifecycles {
  icons: typeof IconName = IconName;
  iconColors: typeof IconColor = IconColor;
  videoBooking = MeetingTypeId.Zoom;
  inboundCall = MeetingTypeId.Inbound;
  outboundCall = MeetingTypeId.Outbound;
  colStartClasses = ColStartClasses;
  today = startOfToday();
  days = CalendarWeekDays;
  spinnerColor = IconColor.Neutral500;
  calendarPending$ = this.store.select(selectors.vendorCalendar.selectPending);
  firstDayOfMonth$ = this.store.select(selectors.vendorCalendar.selectFirstDayOfMonth);
  daysWithEventsData$ = this.store.select(selectors.vendorCalendar.selectDaysWithEventsData);
  selectedEventData: EventData[] = [];
  cancelled = AppointmentStatus.CANCELLED;

  constructor(private store: Store) {
    super();
  }

  getDayOfWeek(date: Date): number {
    const dayOfWeek = getDay(date);
    return dayOfWeek;
  }

  getNextMonth() {
    this.store.dispatch(actions.vendorCalendar.getNextMonth());
  }

  getPrevMonth() {
    this.store.dispatch(actions.vendorCalendar.getPrevMonth());
  }

  showDetailsPage(eventIndex: number | undefined) {
    if (eventIndex) {
      this.store.dispatch(actions.vendorAppointment.redirectToVendorDetailPage({ detailsId: eventIndex }));
    }
  }

  setSelectedEventData(selectedEventData: EventData[]) {
    this.selectedEventData = selectedEventData;
  }
}
