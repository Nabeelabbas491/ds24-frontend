import { AbstractControl, ValidationErrors } from '@angular/forms';
import { BreakPoint, LocalStorageKey, PageBase } from 'src/app/types/misc.type';
import { CalendarEntry } from '../../types/calendar-entry.type';
import { Day } from './../../types/calendar-day.type';
import { getDate, parseISO, isToday, isPast, format, parse, isSameMonth } from 'date-fns';
import { BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { AppointmentDetails, BookingTemplate, EventData } from 'src/app/types/vendor.types';
import * as helper from './util';
import { HttpErrorResponse } from '@angular/common/http';
import { MAPPED_TIMEZONES } from './timezones';
import { Tab } from '../../types/tab.type';
import { SaveVendorSetting } from './../../types/vendor-settings.type';
import { Availability } from './../../types/availability';
import { GoogleIntegrationInfo } from 'src/app/types/google-integration.type';
import { BookingSnapshot } from './../../types/booking.type';

export const DEFAULT_PRODUCT_IMAGAE = './assets/images/product_thumb.png';
export const TEMP_VENDOR_NAME = 'James luke'; //this is as per figma design, once we start getting the vendor name from the API, we'll remove this
export const NO_AUTHORIZATION_TOKEN = 'NO_AUTHORIZATION_TOKEN';
export const GOOGLE_CONNECTED_MESSAGE = 'You are already Connected to Google Calendar.';

export const NO_AUTHORIZATION_HEADER = { headers: { NO_AUTHORIZATION_TOKEN: 'true' } };

export const dayFactory = (
  calendarEntries: CalendarEntry[],
  dateString: string,
  isOtherMonth: boolean = false,
): Day => {
  const day: Day = {
    number: getDate(parseISO(dateString)),
    isToday: isToday(parseISO(dateString)),
    isSelected: false,
    isOtherMonth: isOtherMonth,
    isPast: !isToday(parseISO(dateString)) && isPast(parseISO(dateString)),
    dayMonthYearTitle: dateString,
    isSelectable: true,
  };

  const calendarEntry = calendarEntries.find(x => x.dayTitle === day.dayMonthYearTitle);
  if (calendarEntry) {
    day.slotsArr = [...calendarEntry.slotsArr];
  }
  return day;
};

export const convertToNumber = (timeString: string) => {
  return Number(timeString.replace(':', ''));
};

export const getBreakPoint = (breakpointState: BreakpointState): BreakPoint => {
  if (breakpointState.breakpoints[Breakpoints.XSmall]) {
    return 'xsmall';
  }
  if (breakpointState.breakpoints[Breakpoints.Small]) {
    return 'small';
  }
  if (breakpointState.breakpoints[Breakpoints.Medium]) {
    return 'medium';
  }
  if (breakpointState.breakpoints[Breakpoints.Large]) {
    return 'large';
  }
  if (breakpointState.breakpoints[Breakpoints.XLarge]) {
    return 'xlarge';
  }
  return 'undefined';
};
export const bookingDurations = [
  { text: 'DEFAULT_BOOKING_TIME.FIFTEEN_MINUTES', value: '15' },
  { text: 'DEFAULT_BOOKING_TIME.THIRTY_MINUTES', value: '30' },
  { text: 'DEFAULT_BOOKING_TIME.FORTY_FIVE_MINUTES', value: '45' },
  { text: 'DEFAULT_BOOKING_TIME.SIXTY_MINUTES', value: '60' },
  { text: 'DEFAULT_BOOKING_TIME.NINETY_MINUTES', value: '90' },
  { text: 'DEFAULT_BOOKING_TIME.ONE_HUNDRED_TWENTY_MINUTES', value: '120' },
];

export function checkBookingType(control: AbstractControl) {
  const outbound = control?.get('outbound')?.value;
  const inbound = control?.get('inbound')?.value;
  const video = control?.get('video')?.value;

  if (!outbound && !inbound && !video) {
    return { atLeastOneSelected: true };
  }

  return null;
}

export function updateBookingTemplates(
  editedBookingTemplate: BookingTemplate | undefined,
  updatedBookingTemplates: BookingTemplate[],
) {
  const allUpdatedBookingTemplates = editedBookingTemplate
    ? updatedBookingTemplates.map(template => {
        if (template.id === editedBookingTemplate.id) {
          return { ...template, ...editedBookingTemplate };
        }
        return template;
      })
    : updatedBookingTemplates;

  return allUpdatedBookingTemplates;
}
export function guessTimeZone() {
  const timeZone = helper.getClientTimeZone();

  if (timeZone) {
    return timeZone;
  } else {
    return 'Europe/Berlin';
  }
}
export function getClientTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function returnFormattedDay(selectedDay: Day): string {
  return format(parseISO(selectedDay.dayMonthYearTitle), 'dd MMMM, yyyy');
}

export enum DefaultTime {
  from = '09:00',
  to = '17:00',
}

export const CalendarWeekDays = [
  'CALENDAR_WEEK_DAYS.MONDAY',
  'CALENDAR_WEEK_DAYS.TUESDAY',
  'CALENDAR_WEEK_DAYS.WEDNESDAY',
  'CALENDAR_WEEK_DAYS.THURSDAY',
  'CALENDAR_WEEK_DAYS.FRIDAY',
  'CALENDAR_WEEK_DAYS.SATURDAY',
  'CALENDAR_WEEK_DAYS.SUNDAY',
];

export const ColStartClasses = [
  'col-start-7',
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
];
export function getErrorMessage(arg: HttpErrorResponse): string {
  if (arg.error) {
    if (arg.error.data && typeof arg.error.data === 'object' && arg.error.data[Object.keys(arg.error.data)[0]]) {
      return arg.error.data[Object.keys(arg.error.data)[0]];
    }
    return arg.error.message;
  }

  return arg.message;
}
export function noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return control.value.trim().length ? null : { whitespace: true };
}
export const DEFAULT_ELEMENT_LENGTHS = {
  BOOKING_TEMPLATE_NAME_LENGTH: 40,
  BOOKING_TEMPLATE_COMMENTS_LENGTH: 200,
};

export function getDaysInMonthsData(daysInMonth: Date[], appointmentsData: AppointmentDetails[], startDay: Date) {
  const daysWithEventsData = daysInMonth.map(calendarDay => {
    const appointmentArray: EventData[] = [];

    appointmentsData.forEach(appointmentDay => {
      const appointmentDate = parse(appointmentDay.date, 'yyyy-MM-dd', new Date());
      if (appointmentDate.getTime() === calendarDay.getTime()) {
        appointmentArray.push({
          appointmentTime: `${appointmentDay.startTime}   ${appointmentDay.name}`,
          appointmentId: appointmentDay.id as number,
          appointmentType: appointmentDay.bookingMeetingType.id as number,
          appointmentStatus: appointmentDay.status,
        });
      }
    });
    return {
      date: calendarDay,
      eventsData: appointmentArray.length > 0 ? [...appointmentArray] : [],
      isSameMonth: isSameMonth(calendarDay, startDay),
    };
  });

  return daysWithEventsData;
}

export function guessDefaultTimezone(): string {
  const clientTimeZone = (Intl as any).DateTimeFormat().resolvedOptions().timeZone;
  if (MAPPED_TIMEZONES.hasOwnProperty(clientTimeZone)) {
    return MAPPED_TIMEZONES[clientTimeZone];
  } else {
    return clientTimeZone;
  }
}

export function getSelectedTab(tabItems: Tab[], tabValue: string) {
  return tabItems.map(tab => {
    if (tab.urlSegment === tabValue) {
      return {
        ...tab,
        isSelected: true,
      };
    } else {
      return {
        ...tab,
        isSelected: false,
      };
    }
  });
}

export function downloadFile(fileContent: Blob, fileTitle: string): void {
  const url = window.URL.createObjectURL(fileContent);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileTitle;
  a.click();
  document.body.appendChild(a);
  window.URL.revokeObjectURL(url);
  a.remove();
}
export function buildSettingFormData(vendorSetting: SaveVendorSetting): FormData {
  const formData: FormData = new FormData();
  if (vendorSetting.logo) {
    formData.append('logo', vendorSetting.logo, vendorSetting.logo.name);
  }

  vendorSetting.meetingTypes.forEach((meetingTypeId, index) => {
    formData.append(`meetingTypes[${index}]`, `${meetingTypeId}`);
  });

  formData.append('phoneNumber', vendorSetting.phoneNumber);
  formData.append('primaryColor', vendorSetting.primaryColor);
  formData.append('secondaryColor', vendorSetting.secondaryColor);

  return formData;
}
export function showPagination(pageBase: PageBase): boolean {
  if (pageBase.total <= pageBase.limit) {
    return false;
  }
  return true;
}

export function isBeyondFirstOrLastPage(pageBase: PageBase, currentPage: number): boolean {
  if (currentPage < 1) {
    return true;
  }

  const pageSize: number = Math.ceil(pageBase.total / pageBase.limit);
  if (currentPage > pageSize) {
    return true;
  }

  return false;
}

export function getCookie(name: string): string | null {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(document.cookie);

  const foundCookie = decodedCookie
    .split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith(cookieName));

  return foundCookie ? foundCookie.substring(cookieName.length) : null;
}

export function isNoScheduleExist(availabilities: Availability[]): boolean {
  return availabilities.map(availability => availability.isAvailable).some(availability => availability === true);
}
export function saveIntegrationInfo(integrationInfo: GoogleIntegrationInfo) {
  const localStorageKey: LocalStorageKey = 'integrationInfo';
  localStorage.setItem(localStorageKey, JSON.stringify(integrationInfo));
}
export function getIntegrationInfo(): GoogleIntegrationInfo | null {
  const localStorageKey: LocalStorageKey = 'integrationInfo';
  const integrationInfo = localStorage.getItem(localStorageKey);
  if (integrationInfo) {
    return JSON.parse(integrationInfo);
  }
  return null;
}
export function saveBookingSnapshot(bookingSnapshot: BookingSnapshot) {
  const localStorageKey: LocalStorageKey = 'bookingSnapshot';
  localStorage.setItem(localStorageKey, JSON.stringify(bookingSnapshot));
}
export function getBookingSnapshot(): BookingSnapshot | null {
  const localStorageKey: LocalStorageKey = 'bookingSnapshot';
  const bookingSnapshot = localStorage.getItem(localStorageKey);
  localStorage.removeItem(localStorageKey);
  if (bookingSnapshot) {
    return JSON.parse(bookingSnapshot);
  }
  return null;
}
