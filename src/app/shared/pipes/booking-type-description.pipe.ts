import { Pipe, PipeTransform } from '@angular/core';
import { MeetingType, MeetingTypeDescriptionType } from './../../types/misc.type';
import { MeetingTypeId } from './../../types/booking.type';

@Pipe({
  name: 'bookingTypeDescription',
})
export class BookingTypeDescriptionPipe implements PipeTransform {
  transform(meetingType: MeetingType, descriptionType: MeetingTypeDescriptionType = 'default'): string {
    let description = '';
    if (descriptionType === 'default') {
      switch (meetingType.id) {
        case MeetingTypeId.Inbound:
          description = 'VENDOR.BOOKING.INBOUND_DESCRIPTION';
          break;
        case MeetingTypeId.Outbound:
          description = 'VENDOR.BOOKING.OUTBOUND_DESCRIPTION';
          break;
        case MeetingTypeId.Zoom:
          description = 'VENDOR.BOOKING.VIDEO_DESCRIPTION';
          break;
      }
    } else {
      switch (meetingType.id) {
        case MeetingTypeId.Inbound:
          description = 'VENDOR_SETTINGS.BOOKING_TYPE.INBOUND_PHONE_CALL.DESCRIPTION';
          break;
        case MeetingTypeId.Outbound:
          description = 'VENDOR_SETTINGS.BOOKING_TYPE.OUTBOUND_PHONE_CALL.DESCRIPTION';
          break;
        case MeetingTypeId.Zoom:
          description = 'VENDOR_SETTINGS.BOOKING_TYPE.VIDEO_CONFERENCE.DESCRIPTION';
          break;
      }
    }
    return description;
  }
}
