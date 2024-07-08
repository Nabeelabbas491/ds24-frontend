import { AvailabilityType, DayName } from './misc.type';
import { TimeSlot } from './vendor.types';

export interface TimeSlotAvailability {
  availableTimeSlots: TimeSlot[];
}
export interface Availability {
  startDate: string | null;
  endDate: string | null;
  type: AvailabilityType;
  isAvailable: boolean;
  day: DayName;
}
export interface Schedule {
  id: number;
  tomeZone: string;
  availabilities: Availability[];
}
