import {
  DayDetail,
  AppointmentDetails,
  AppointmentList,
  CalendarDayDetails,
  WeekSchedule,
  Availibility,
  SaveBookingTemplate,
  FormDayDetail,
} from '../types/vendor.types';
import { MeetingTypeId } from './booking.type';
import { GenericResponse } from './misc.type';
const EVENTS_MOCK_DATA = [
  {
    appointmentTime: '14:00 Full Name',
    appointmentId: 1,
    appointmentType: MeetingTypeId.Inbound,
    appointmentStatus: 'scheduled',
  },
  {
    appointmentTime: '14:00 Full Name',
    appointmentId: 2,
    appointmentType: MeetingTypeId.Inbound,
    appointmentStatus: 'scheduled',
  },
  {
    appointmentTime: '14:00 Full Name',
    appointmentId: 3,
    appointmentType: MeetingTypeId.Zoom,
    appointmentStatus: 'scheduled',
  },
];
export const InitialEventsData: CalendarDayDetails[] = [
  {
    date: new Date('December 17, 2023'),
    eventsData: EVENTS_MOCK_DATA,
    isSameMonth: false,
  },
  {
    date: new Date('January 3, 2023'),
    eventsData: EVENTS_MOCK_DATA,
    isSameMonth: false,
  },
  {
    date: new Date('December 20, 2023'),
    eventsData: EVENTS_MOCK_DATA,
    isSameMonth: false,
  },
  {
    date: new Date('December 02, 2023'),
    eventsData: [],
    isSameMonth: true,
  },
];

const otherMonthEmptyData = {
  eventsData: [],
  isSameMonth: false,
};

const currentMonthEmptyData = {
  eventsData: [],
  isSameMonth: true,
};

export const sampleMonthData: CalendarDayDetails[] = [
  { date: new Date('2023-11-27'), ...otherMonthEmptyData },
  { date: new Date('2023-11-28'), ...otherMonthEmptyData },
  { date: new Date('2023-11-29'), ...otherMonthEmptyData },
  { date: new Date('2023-11-30'), ...otherMonthEmptyData },
  { date: new Date('2023-12-01'), ...currentMonthEmptyData },
  { date: new Date('2023-12-02'), ...currentMonthEmptyData },
  { date: new Date('2023-12-03'), ...currentMonthEmptyData },
  { date: new Date('2023-12-04'), ...currentMonthEmptyData },
  { date: new Date('2023-12-05'), ...currentMonthEmptyData },
  { date: new Date('2023-12-06'), ...currentMonthEmptyData },
  { date: new Date('2023-12-07'), ...currentMonthEmptyData },
  { date: new Date('2023-12-08'), ...currentMonthEmptyData },
  { date: new Date('2023-12-09'), ...currentMonthEmptyData },
  { date: new Date('2023-12-10'), ...currentMonthEmptyData },
  { date: new Date('2023-12-11'), ...currentMonthEmptyData },
  {
    date: new Date('2023-12-12'),
    eventsData: [
      {
        appointmentTime: '10:00   Nabeel',
        appointmentId: 1,
        appointmentType: 1,
        appointmentStatus: 'scheduled',
      },
      {
        appointmentTime: '10:00   Bhoomi',
        appointmentId: 2,
        appointmentType: 1,
        appointmentStatus: 'scheduled',
      },
      {
        appointmentTime: '10:00   Nabeel',
        appointmentId: 3,
        appointmentType: 1,
        appointmentStatus: 'scheduled',
      },
    ],
    isSameMonth: true,
  },
  { date: new Date('2023-12-13'), ...currentMonthEmptyData },
  { date: new Date('2023-12-14'), ...currentMonthEmptyData },
  { date: new Date('2023-12-15'), ...currentMonthEmptyData },
  { date: new Date('2023-12-16'), ...currentMonthEmptyData },
  { date: new Date('2023-12-17'), ...currentMonthEmptyData },
  { date: new Date('2023-12-18'), ...currentMonthEmptyData },
  { date: new Date('2023-12-19'), ...currentMonthEmptyData },
  { date: new Date('2023-12-20'), ...currentMonthEmptyData },
  { date: new Date('2023-12-21'), ...currentMonthEmptyData },
  { date: new Date('2023-12-22'), ...currentMonthEmptyData },
  { date: new Date('2023-12-23'), ...currentMonthEmptyData },
  { date: new Date('2023-12-24'), ...currentMonthEmptyData },
  { date: new Date('2023-12-25'), ...currentMonthEmptyData },
  { date: new Date('2023-12-26'), ...currentMonthEmptyData },
  { date: new Date('2023-12-27'), ...currentMonthEmptyData },
  { date: new Date('2023-12-28'), ...currentMonthEmptyData },
  { date: new Date('2023-12-29'), ...currentMonthEmptyData },
  { date: new Date('2023-12-30'), ...currentMonthEmptyData },
  { date: new Date('2023-12-31'), ...currentMonthEmptyData },
];
export const appointmentListData: AppointmentList = {
  appointments: [
    {
      id: 1,
      timezone: 'Asia/Kolkata',
      abbreviatedTimeZone: 'IST',
      date: '2023-12-12',
      startTime: '10:00',
      endTime: '10:40',
      name: 'Nabeel',
      email: 'nabeel@digistore.com',
      note: 'Lorem ipsum dolor sit amet consectetur. Amet tortor molestie lacus nisl imperdiet montes lectus eget felis. Quam mattis commodo duis suspendisse imperdiet sed diam nullam.',
      phoneNumber: '+83 247281912',
      status: 'scheduled',
      bookingMeetingType: {
        id: 1,
        name: 'Inbound Phone Call',
      },
      bookingProduct: {
        id: 2,
        productId: 23,
        productName: 'Disco Tenzen Lernen Level 1 - Mitgliederzugang',
      },
      zoomLink: 'https://meet.asdyuus6723291',
      vendorGoogleSynced: false,
    },
    {
      id: 2,
      timezone: 'Asia/Kolkata',
      abbreviatedTimeZone: 'IST',
      date: '2023-12-12',
      startTime: '10:00',
      endTime: '10:40',
      name: 'Bhoomi',
      email: 'nabeel@digistore.com',
      note: 'Lorem ipsum dolor sit amet consectetur. Amet tortor molestie lacus nisl imperdiet montes lectus eget felis. Quam mattis commodo duis suspendisse imperdiet sed diam nullam.',
      phoneNumber: '+83 247281912',
      status: 'scheduled',
      bookingMeetingType: {
        id: 1,
        name: 'Inbound Phone Call',
      },
      bookingProduct: {
        id: 2,
        productId: 23,
        productName: 'Disco Tenzen Lernen Level 1 - Mitgliederzugang',
      },
      zoomLink: 'https://meet.asdyuus6723291',
      vendorGoogleSynced: false,
    },
    {
      id: 3,
      timezone: 'Asia/Kolkata',
      abbreviatedTimeZone: 'IST',
      date: '2023-12-12',
      startTime: '10:00',
      endTime: '10:40',
      name: 'Nabeel',
      email: 'nabeel@digistore.com',
      note: 'Lorem ipsum dolor sit amet consectetur. Amet tortor molestie lacus nisl imperdiet montes lectus eget felis. Quam mattis commodo duis suspendisse imperdiet sed diam nullam.',
      phoneNumber: '+83 247281912',
      status: 'scheduled',
      bookingMeetingType: {
        id: 1,
        name: 'Inbound Phone Call',
      },
      bookingProduct: {
        id: 2,
        productId: 23,
        productName: 'Disco Tenzen Lernen Level 1 - Mitgliederzugang',
      },
      zoomLink: 'https://meet.asdyuus6723291',
      vendorGoogleSynced: false,
    },
  ],
  total: 1,
  page: 1,
  limit: 10,
};

export const appointmentDetailData: AppointmentDetails = {
  id: 1,
  timezone: 'Asia/Kolkata',
  abbreviatedTimeZone: 'IST',
  date: '2023-12-12',
  startTime: '10:00:00',
  endTime: '10:40:00',
  name: 'Bhoomi',
  email: 'bhoomi@digistore.com',
  note: 'Lorem ipsum dolor sit amet consectetur. Amet tortor molestie lacus nisl imperdiet montes lectus eget felis. Quam mattis commodo duis suspendisse imperdiet sed diam nullam.',
  phoneNumber: '+83 247281912',
  status: 'scheduled',
  bookingMeetingType: {
    id: 1,
    name: 'Inbound Phone Call',
  },
  bookingProduct: {
    id: 2,
    productId: 23,
    productName: 'Disco Tenzen Lernen Level 1 - Mitgliederzugang',
    productImageUrl: '',
  },
  zoomLink: 'https://meet.asdyuus6723291',
  vendorGoogleSynced: false,
};

const sampleTimeSlot = {
  from: '10:00',
  to: '19:00',
};

export const dayDetails: DayDetail[] = [
  {
    dayOfWeek: 'MON',
    selected: true,
    unavailable: false,
    slot: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'TUE',
    selected: true,
    unavailable: false,
    slot: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'WED',
    selected: true,
    unavailable: false,
    slot: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'THU',
    selected: true,
    unavailable: false,
    slot: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'FRI',
    selected: true,
    unavailable: false,
    slot: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'SAT',
    selected: false,
    unavailable: true,
    slot: [],
  },
  {
    dayOfWeek: 'SUN',
    selected: false,
    unavailable: true,
    slot: [],
  },
];

export const formDayDetails: FormDayDetail[] = [
  {
    dayOfWeek: 'MON',
    selected: true,
    unavailable: false,
    timeRange: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'TUE',
    selected: true,
    unavailable: false,
    timeRange: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'WED',
    selected: true,
    unavailable: false,
    timeRange: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'THU',
    selected: true,
    unavailable: false,
    timeRange: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'FRI',
    selected: true,
    unavailable: false,
    timeRange: [sampleTimeSlot],
  },
  {
    dayOfWeek: 'SAT',
    selected: false,
    unavailable: true,
    timeRange: [],
  },
  {
    dayOfWeek: 'SUN',
    selected: false,
    unavailable: true,
    timeRange: [],
  },
];

const generalDayDetail: Omit<Availibility, 'day'> = {
  startDate: null,
  endDate: null,
  type: 'default',
  slot: [sampleTimeSlot],
};

export const weekSchedule: WeekSchedule = {
  timeZone: 'UTC',
  availabilities: [
    {
      ...generalDayDetail,
      day: 'monday',
    },
    {
      ...generalDayDetail,
      day: 'tuesday',
    },
    {
      ...generalDayDetail,
      day: 'wednesday',
    },
    {
      ...generalDayDetail,
      day: 'thursday',
    },
    {
      ...generalDayDetail,
      day: 'friday',
    },
    {
      startDate: null,
      endDate: null,
      type: 'default',
      slot: [],
      day: 'saturday',
    },
    {
      startDate: null,
      endDate: null,
      type: 'default',
      slot: [],
      day: 'sunday',
    },
  ],
};

export const sampleWeekResponse: GenericResponse<WeekSchedule> = {
  status: 200,
  data: weekSchedule,
  message: 'Scheduled retreived successfully',
};

export const sampleCreateBookingTemplate: SaveBookingTemplate = {
  name: 'test',
  description: '',
  duration: 1,
  products: [1, 2, 3],
  phoneNumber: '123-456',
  meetingTypes: [1],
};

export const displayedColumns = ['name', 'date', 'time', 'bookingType', 'product', 'actions'];

export const blankAvailabilities: Availibility[] = [
  {
    id: 1,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'monday',
    slot: [],
  },
  {
    id: 2,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'tuesday',
    slot: [],
  },
  {
    id: 3,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'wednesday',
    slot: [],
  },
  {
    id: 4,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'thursday',
    slot: [],
  },
  {
    id: 5,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'friday',
    slot: [],
  },
  {
    id: 6,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'saturday',
    slot: [],
  },
  {
    id: 7,
    startDate: null,
    endDate: null,
    type: 'default',
    day: 'sunday',
    slot: [],
  },
];

export const unavailableWeekSchedule: WeekSchedule = {
  id: 1,
  timeZone: 'UTC',
  availabilities: blankAvailabilities,
};

export const overrideTimeSlots = [
  {
    from: '10:00',
    to: '11:00',
  },
  {
    from: '12:00',
    to: '13:00',
  },
];
