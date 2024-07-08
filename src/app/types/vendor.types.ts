import { AvailabilityType, ModalState } from './misc.type';
import { VendorSetting } from './vendor-settings.type';
import { BookingTemplateListItem } from './vendor.booking-template.type';

export const DEFAULT_SLOT_FROM = '10:00';
export const DEFAULT_SLOT_TO = '19:00';
export interface SaveBookingTemplate {
  name: string;
  description: string;
  duration: number;
  products: number[];
  phoneNumber: string;
  meetingTypes: number[];
}

export interface BookingMeetingType {
  id: number | null;
  name: string;
}

export interface BookingProduct {
  id: number | null;
  productId: number | null;
  productName: string;
  productImageUrl?: string;
}

export interface AppointmentListParams {
  searchValue?: string;
  page?: number;
  limit?: number;
  month?: number;
  year?: number;
  sortOrder?: string;
  [key: string]: string | number | undefined | null;
}

export interface AppointmentList {
  appointments: AppointmentDetails[];
  total: number;
  page: number;
  limit: number;
}
export interface AppointmentDetails {
  id: number | null;
  timezone: string;
  abbreviatedTimeZone: string;
  date: string;
  startTime: string;
  endTime: string;
  name: string;
  email: string;
  note: string | null;
  phoneNumber: string | null;
  status: string;
  bookingMeetingType: BookingMeetingType;
  bookingProduct: BookingProduct;
  zoomLink: string;
  vendorGoogleSynced: boolean;
}

export interface BookingTemplate {
  id: string;
  templateName: string;
  description: string;
  products: string[];
  firstProduct: string;
  remainingProductCount: number;
  duration: string;
  bookingType: string;
}

export enum BookingType {
  outbound = 'Outbound Phone Call',
  inbound = 'Inbound Phone Call',
  video = 'Video Conference with Zoom',
}

export interface MeetingProduct {
  id: string;
  product_group_id: string;
  name: string;
  vendor_id: string;
  product_group_name: string;
  is_attached: boolean;
}
export interface BookingTemplateCollection {
  meetingProducts: MeetingProduct[];
  bookingTemplateDetail: BookingTemplateListItem | null;
  vendorSetting: VendorSetting | null;
  modalState: ModalState;
}

export interface DayDetail {
  dayOfWeek?: string;
  selected?: boolean;
  unavailable?: boolean;
  slot: TimeSlot[];
}

export interface FormDayDetail {
  dayOfWeek?: string;
  selected?: boolean;
  unavailable?: boolean;
  timeRange: TimeSlot[];
}

export interface TimeSlot {
  from?: string;
  to?: string;
}

export interface WeekSchedule {
  id?: number | null;
  timeZone: string;
  availabilities: Availibility[];
}

export interface Availibility {
  id?: number;
  startDate: string | null;
  endDate: string | null;
  day: string;
  type: AvailabilityType;
  slot: TimeSlot[];
}

export interface EventData {
  appointmentTime: string;
  appointmentId: number;
  appointmentType: number;
  appointmentStatus: string;
}

export enum SortType {
  ASCENDING = 'asc',
  DESCENDING = 'desc',
}

export enum VendorListingParamType {
  SORTORDER = 'sortOrder',
  PAGE = 'page',
  LIMIT = 'limit',
}

export enum AppointmentStatus {
  CANCELLED = 'cancelled',
  SCHEDULED = 'scheduled',
}

export interface CalendarDayDetails {
  date: Date;
  eventsData: EventData[];
  isSameMonth?: boolean;
}

export interface CalendarData {
  days: CalendarDayDetails[];
  total: number;
}

export interface EditOverrideDetails {
  startDate: string | null;
  endDate: string | null;
  slots: TimeSlot[];
  updateIndex: number | undefined;
}
