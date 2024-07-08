import { MeetingType, PageBase } from './misc.type';

export interface BookingProduct {
  id: number;
  name: string;
  uuid: string;
}
export interface BookingTemplateListItem {
  id: number;
  name: string;
  description: string;
  duration: number;
  bookingMeetingTypes: MeetingType[];
  bookingProducts: BookingProduct[];
}
export interface BookingTemplateList extends PageBase {
  bookingTemplates: BookingTemplateListItem[];
}
