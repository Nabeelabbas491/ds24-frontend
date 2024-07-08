export type DateFormat = 'full' | 'full_without_year' | 'day_month_year' | 'day_half-month_year'; //more DateFormats will be added as requirements arise.
export type BreakPoint = 'xlarge' | 'large' | 'medium' | 'small' | 'xsmall' | 'undefined';
export type ModalState = 'create' | 'edit';
export type SettingPageState = 'create' | 'edit';
export type MeetingTypeDescriptionType = 'default' | 'settingPage';
export type AvailabilityType = 'default' | 'override';
export type DayName = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type CalendarMode = 'clientbooking' | 'dateoverride';
export type GoogleIntegrationMode = 'client-booking' | 'vendor-appointment';
export type LocalStorageKey = 'integrationInfo' | 'bookingSnapshot';

export interface PageBase {
  total: number;
  page: number;
  limit: number;
}

export interface GenericResponse<T> {
  status: number;
  message: string;
  data: T;
}
export interface MeetingType {
  id: number;
  name: string;
}
export interface ScheduleDate {
  date: string;
  timezone_type: number;
  timezone: string;
}
export interface DateRange {
  startDate: string;
  endDate: string;
}
export interface Timeslot {
  to: string;
  from: string;
}
export enum StatusCode {
  EMPTY = 404,
  SUCCESS = 200,
  INVALID = 422,
}
