export const bookingTemplateMock = {
  bookingTemplate: {
    id: 1,
    name: 'new 1',
    description: 'new test description',
    startDate: {
      date: '2023-12-01',
      timezone_type: 3,
      timezone: 'UTC',
    },
    endDate: {
      date: '2023-12-31',
      timezone_type: 3,
      timezone: 'UTC',
    },
    bufferTime: 10,
    duration: 30,
  },
  bookingProduct: {
    id: 1,
    url: 'some url',
    productId: 23,
    uuid: 'test uuid',
    zoomLink: 'test url link',
  },
  bookingMeetingTypes: [
    {
      id: 1,
      name: 'Inbound Phone Call',
    },
    {
      id: 2,
      name: 'Outbound Phone Call',
    },
  ],
  availabilities: [
    {
      startDate: null,
      endDate: null,
      type: 'default',
      day: 'wednesday',
      isAvailable: true,
    },
    {
      startDate: null,
      endDate: null,
      type: 'default',
      day: 'thursday',
      isAvailable: true,
    },
    {
      id: 3,
      startDate: {
        date: '2023-12-20',
        timezone_type: 3,
        timezone: 'UTC',
      },
      endDate: {
        date: '2023-12-20',
        timezone_type: 3,
        timezone: 'UTC',
      },
      type: 'override',
      day: 'wednesday',
      isAvailable: true,
    },
  ],
};
