import { MeetingType } from './../../types/misc.type';
import { BookingTypeDescriptionPipe } from './booking-type-description.pipe';

describe('BookingTypeDescriptionPipe', () => {
  let pipe: BookingTypeDescriptionPipe;

  beforeEach(() => {
    pipe = new BookingTypeDescriptionPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return description for inbound booking type - type=default', () => {
    const meetingType: MeetingType = {
      id: 1,
      name: 'Inbound Phone Call',
    };
    expect(pipe.transform(meetingType, 'default')).toEqual('VENDOR.BOOKING.INBOUND_DESCRIPTION');
  });

  it('should return description for outbound booking type - type=default', () => {
    const meetingType: MeetingType = {
      id: 2,
      name: 'Outbound Phone Call',
    };

    expect(pipe.transform(meetingType, 'default')).toEqual('VENDOR.BOOKING.OUTBOUND_DESCRIPTION');
  });

  it('should return description for zoom meeting booking type - type=default', () => {
    const meetingType: MeetingType = {
      id: 3,
      name: 'Video Call',
    };

    expect(pipe.transform(meetingType, 'default')).toEqual('VENDOR.BOOKING.VIDEO_DESCRIPTION');
  });

  it('should return description for inbound booking type - type=settingPage', () => {
    const meetingType: MeetingType = {
      id: 1,
      name: 'Inbound Phone Call',
    };
    expect(pipe.transform(meetingType, 'settingPage')).toEqual(
      'VENDOR_SETTINGS.BOOKING_TYPE.INBOUND_PHONE_CALL.DESCRIPTION',
    );
  });

  it('should return description for outbound booking type - type=settingPage', () => {
    const meetingType: MeetingType = {
      id: 2,
      name: 'Outbound Phone Call',
    };
    expect(pipe.transform(meetingType, 'settingPage')).toEqual(
      'VENDOR_SETTINGS.BOOKING_TYPE.OUTBOUND_PHONE_CALL.DESCRIPTION',
    );
  });

  it('should return description for zoom meeting booking type - type=settingPage', () => {
    const meetingType: MeetingType = {
      id: 3,
      name: 'Video Call',
    };
    expect(pipe.transform(meetingType, 'settingPage')).toEqual(
      'VENDOR_SETTINGS.BOOKING_TYPE.VIDEO_CONFERENCE.DESCRIPTION',
    );
  });

  it('should return empty description for unknown meeting type', () => {
    const meetingType: MeetingType = {
      id: 0,
      name: 'Unknown Meeting Type',
    };

    expect(pipe.transform(meetingType)).toEqual('');
  });
});
