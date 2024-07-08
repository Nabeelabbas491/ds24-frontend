import { Availability } from './availability';
import { BookingProduct } from './booking-product.type';
import { Day, Slot } from './calendar-day.type';
import { MeetingType } from './misc.type';

export interface BookingTemplateDetail {
  bookingTemplate: BookingTemplate;
  bookingProduct: BookingProduct;
  bookingMeetingTypes: MeetingType[];
  availabilities: Availability[];
}
export interface BookingTemplate {
  id: number;
  name: string;
  bufferTime: number;
  description: string;
  duration: number;
}
export interface CreateBooking extends BookingDetail {
  timeZone: string;
  meetingType: number | undefined;
  startTime: string | undefined;
  date: string | undefined;
}
export interface CreateBookingResponse {
  appointmentId: number;
  zoomLink: string;
  phoneNumber: string;
}
export interface BookingDetail {
  name: string;
  email: string;
  phoneNo: string;
  note: string;
}
export interface BookingSaveSuccess {
  appointmentId: number;
  zoomLink: string;
  vendorPhoneNumber: string;
  name: string;
  meetingTypeDetail: MeetingType | null;
  timeSlot: Slot | null;
  dayTitle: string | undefined;
}
export enum MeetingTypeId {
  Inbound = 1,
  Outbound = 2,
  Zoom = 3,
}
export type BookingStep = 'calendar' | 'booking_type' | 'booking_form' | 'summary';

export interface BookingTemplateSummary {
  heading: string;
  duration: number;
  userName: string;
  imageUrl: string;
}

export interface BookingTemplatePayload {
  paramId: string;
  isClient: boolean;
}
export interface BookingSnapshot {
  currentStep: BookingStep;
  selectedDay: Day | null;
  meetingType: MeetingType | null;
  timeZone: string;
  prevTimeSlot: Slot | null;
  timeSlot: Slot | null;
  bookingTemplateSummary: BookingTemplateSummary;
  isBookingSynced: boolean;
  bookingSaveSuccess: BookingSaveSuccess | null;
}
