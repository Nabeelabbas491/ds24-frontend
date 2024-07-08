import { entriesMock } from './../../types/calendar-entries.types.mock';
import {
  buildSettingFormData,
  dayFactory,
  downloadFile,
  getBookingSnapshot,
  getBreakPoint,
  getClientTimeZone,
  getCookie,
  getDaysInMonthsData,
  getErrorMessage,
  getIntegrationInfo,
  guessTimeZone,
  isBeyondFirstOrLastPage,
  isNoScheduleExist,
  returnFormattedDay,
  saveBookingSnapshot,
  saveIntegrationInfo,
  showPagination,
  updateBookingTemplates,
} from './util';
import { Day } from './../../types/calendar-day.type';
import { Breakpoints } from '@angular/cdk/layout';
import * as helper from './util';
import { HttpErrorResponse } from '@angular/common/http';
import { appointmentDetailData } from '../../types/vendor.types.mock';
import { getSelectedTab } from './util';
import { SaveVendorSetting } from './../../types/vendor-settings.type';
import { Availability } from './../../types/availability';
import { PageBase } from './../../types/misc.type';
import { GoogleIntegrationInfo } from './../../types/google-integration.type';

describe('util tests', () => {
  it('construct day object with time slots', () => {
    const result = dayFactory(entriesMock, '2023-10-25');

    const day: Day = {
      number: 25,
      isToday: false,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: true,
      dayMonthYearTitle: '2023-10-25',
      slotsArr: [
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '10:00', endTime: '10:30' },
        { startTime: '11:00', endTime: '11:30' },
        { startTime: '12:00', endTime: '12:30' },
      ],
    };

    expect(result).toStrictEqual(day);
  });
  it('construct day object without time slots', () => {
    const result = dayFactory(entriesMock, '2023-10-08');

    const day: Day = {
      number: 8,
      isToday: false,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: true,
      dayMonthYearTitle: '2023-10-08',
    };

    expect(result).toStrictEqual(day);
  });

  it('if breakpoint state is Small, return small', () => {
    const mockBreakPointState = {
      breakpoints: { [Breakpoints.Small]: true },
      matches: true,
    };
    const result = getBreakPoint(mockBreakPointState);

    expect(result).toBe('small');
  });

  it('if break point state cant be determined, return undefined', () => {
    const mockBreakPointState = {
      breakpoints: { [Breakpoints.TabletPortrait]: true },
      matches: true,
    };
    const result = getBreakPoint(mockBreakPointState);

    expect(result).toBe('undefined');
  });
  it('should update the booking template in the array if editedBookingTemplate is provided', () => {
    const editedBookingTemplate = {
      id: '0',
      templateName: 'sample edited name',
      description: 'sample description name',
      products: [],
      duration: '',
      bookingType: '',
      firstProduct: '',
      remainingProductCount: 0,
    };
    const updatedBookingTemplates = [
      {
        id: '0',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
      {
        id: '1',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
    ];

    const result = updateBookingTemplates(editedBookingTemplate, updatedBookingTemplates);
    expect(result).toHaveLength(updatedBookingTemplates.length);
  });

  it('should return the original array if editedBookingTemplate is not provided', () => {
    const updatedBookingTemplates = [
      {
        id: '0',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
      {
        id: '1',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
    ];

    const result = updateBookingTemplates(undefined, updatedBookingTemplates);

    expect(result).toEqual(updatedBookingTemplates);
  });

  it('should handle undefined editedBookingTemplate gracefully', () => {
    const updatedBookingTemplates = [
      {
        id: '0',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
      {
        id: '1',
        templateName: 'sample name',
        description: 'sample description name',
        products: [],
        duration: '',
        bookingType: '',
        firstProduct: '',
        remainingProductCount: 0,
      },
    ];

    const result = updateBookingTemplates(undefined, updatedBookingTemplates);

    expect(result).toEqual(updatedBookingTemplates);
  });

  it('guessTimeZone should return default time zone if system is unable to get client timezone', () => {
    const spy = jest.spyOn(helper, 'getClientTimeZone');
    spy.mockReturnValue('');

    const timeZone = 'Europe/Berlin';
    expect(guessTimeZone()).toEqual(timeZone);
  });

  it('guessTimeZone should return timezone', () => {
    const timeZone = 'Asia/Karachi';
    const spy = jest.spyOn(helper, 'getClientTimeZone');
    spy.mockReturnValue(timeZone);
    expect(guessTimeZone()).toEqual(timeZone);
  });

  it('getClientTimeZone should return client timezone', () => {
    const timeZone = 'Asia/Karachi';
    const spy = jest.spyOn(helper, 'getClientTimeZone');
    spy.mockReturnValue(timeZone);
    expect(getClientTimeZone()).toEqual(timeZone);
  });

  it('getErrorMessage - return error message from error object', () => {
    const error = {
      error: { message: 'some error' },
    };
    const arg: HttpErrorResponse = new HttpErrorResponse(error);
    expect(getErrorMessage(arg)).toEqual('some error');
  });

  it('getErrorMessage - return inner error message from data object of error object if error message exists', () => {
    const innerErrorMessage = 'image size not allowed';
    const errorArg = {
      error: { message: 'some error', data: { '': innerErrorMessage } },
    };
    const arg: HttpErrorResponse = new HttpErrorResponse(errorArg);
    expect(getErrorMessage(arg)).toEqual(innerErrorMessage);
  });
  it('getErrorMessage - return outer error message from if inner data object of error object does not have error message', () => {
    const innerErrorMessage = '';
    const errorArg = {
      error: { message: 'some error', data: { '': innerErrorMessage } },
    };
    const arg: HttpErrorResponse = new HttpErrorResponse(errorArg);
    expect(getErrorMessage(arg)).toEqual('some error');
  });
  it('getErrorMessage - return outer error message from if inner data object of error object is an empty object', () => {
    const errorArg = {
      error: { message: 'some error', data: {} },
    };
    const arg: HttpErrorResponse = new HttpErrorResponse(errorArg);
    expect(getErrorMessage(arg)).toEqual('some error');
  });

  it('getErrorMessage - if error object is null', () => {
    const error = {
      error: null,
    };
    const arg: HttpErrorResponse = new HttpErrorResponse(error);
    expect(getErrorMessage(arg)).toEqual(arg.message);
  });
});
describe('returnFormattedDay', () => {
  it('should format the day correctly', () => {
    const selectedDay: Day = {
      number: 26,
      isToday: true,
      isSelected: false,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '2023-12-26',
      slotsArr: [
        { startTime: '09:00', endTime: '09:30' },
        { startTime: '10:00', endTime: '10:30' },
        { startTime: '11:00', endTime: '11:30' },
        { startTime: '12:00', endTime: '12:30' },
      ],
    };

    const formattedDay = returnFormattedDay(selectedDay);

    const expectedFormattedDay = '26 December, 2023';

    expect(formattedDay).toBe(expectedFormattedDay);
  });
});

describe('getDaysInMonthsData', () => {
  it('should return correct daysWithEventsData', () => {
    const daysInMonth: Date[] = [new Date('2024-01-01'), new Date('2023-12-12')];

    const appointmentsData = [appointmentDetailData];

    const result = getDaysInMonthsData(daysInMonth, appointmentsData, new Date('2023-12-12'));

    expect(result).toBeDefined();
    expect(result.length).toBe(daysInMonth.length);

    const firstDayDetails = result[0];
    expect(firstDayDetails.date).toEqual(daysInMonth[0]);
    expect(firstDayDetails.isSameMonth).toBeFalsy();
    expect(firstDayDetails.eventsData).toBeDefined();
  });
});

describe('getSelectedTab', () => {
  it('should set isSelected to true for the matching tabValue', () => {
    const tabItems = [
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: false },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: true },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: false },
    ];
    const tabValue = 'tab1';

    const result = getSelectedTab(tabItems, tabValue);

    expect(result).toEqual([
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: true },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: false },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: false },
    ]);
  });

  it('should set isSelected to false for non-matching tabValue', () => {
    const tabItems = [
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: false },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: true },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: false },
    ];

    const tabValue = 'tab3';

    const result = getSelectedTab(tabItems, tabValue);

    expect(result).toEqual([
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: false },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: false },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: true },
    ]);
  });

  it('should not modify the original tabItems array', () => {
    const tabItems = [
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: false },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: true },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: false },
    ];
    const tabValue = 'tab2';

    const result = getSelectedTab(tabItems, tabValue);

    expect(result).toEqual([
      { id: 0, title: 'tab1', urlSegment: 'tab1', isSelected: false },
      { id: 1, title: 'tab2', urlSegment: 'tab2', isSelected: true },
      { id: 2, title: 'tab3', urlSegment: 'tab3', isSelected: false },
    ]);
  });
});

describe('downloadFile', () => {
  let windowSpy: any;
  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });
  it('downloadFile meethod tests', () => {
    const icsFileContent = new Blob(['testing']);
    const fileName = 'appointment.ics';

    windowSpy.mockImplementation(() => ({
      URL: {
        createObjectURL: () => 'dummy url',
        revokeObjectURL: () => {},
      },
    }));

    downloadFile(icsFileContent, fileName);

    expect(windowSpy).toHaveBeenCalled();
  });
});

describe('buildSettingFormData', () => {
  it('buildSettingFormData meethod tests', () => {
    const saveVendorSetting: SaveVendorSetting = {
      logo: undefined,
      primaryColor: 'red',
      secondaryColor: 'blue',
      phoneNumber: '123-456',
      meetingTypes: [1, 2],
    };

    const formData: FormData = new FormData();
    formData.append(`meetingTypes[0]`, '1');
    formData.append(`meetingTypes[1]`, '2');

    formData.append('phoneNumber', '123-456');
    formData.append('primaryColor', 'red');
    formData.append('secondaryColor', 'blue');

    const result = buildSettingFormData(saveVendorSetting);

    expect(result).toEqual(formData);
  });
});

describe('showPagination', () => {
  it('should not show pagination if total is less than equal to limit', () => {
    const pageBase: PageBase = {
      total: 1,
      limit: 10,
      page: 1,
    };

    const showPaginationResult = showPagination(pageBase);

    expect(showPaginationResult).toBe(false);
  });
  it('should show pagination if total is less than equal to limit', () => {
    const pageBase: PageBase = {
      total: 15,
      limit: 10,
      page: 1,
    };

    const showPaginationResult = showPagination(pageBase);

    expect(showPaginationResult).toBe(true);
  });
});
describe('isFirstOrLastPage', () => {
  it('should return false if its beyond first page', () => {
    const pageBase: PageBase = {
      total: 50,
      limit: 10,
      page: 1,
    };

    const isFirstPage = isBeyondFirstOrLastPage(pageBase, 0);

    expect(isFirstPage).toBe(true);
  });
  it('should return true if its beyond last page', () => {
    const pageBase: PageBase = {
      total: 55,
      limit: 10,
      page: 10,
    };

    const showPaginationResult = isBeyondFirstOrLastPage(pageBase, 12);

    expect(showPaginationResult).toBe(true);
  });

  it('should return true if its first page', () => {
    const pageBase: PageBase = {
      total: 55,
      limit: 10,
      page: 1,
    };

    const showPaginationResult = isBeyondFirstOrLastPage(pageBase, 1);

    expect(showPaginationResult).toBe(false);
  });
  it('should return true if its last page', () => {
    const pageBase: PageBase = {
      total: 55,
      limit: 10,
      page: 10,
    };

    const showPaginationResult = isBeyondFirstOrLastPage(pageBase, 11);

    expect(showPaginationResult).toBe(true);
  });
});

describe('getCookie function', () => {
  const originalDocumentCookie = document.cookie;
  beforeAll(() => {
    Object.defineProperty(document, 'cookie', {
      value: 'test1=value1; test2=value2; test3=value3',
      writable: true,
    });
  });

  afterAll(() => {
    document.cookie = originalDocumentCookie;
  });

  it('should return null if cookie does not exist', () => {
    expect(getCookie('nonexistent')).toBeNull();
  });

  it('should return correct value for existing cookie', () => {
    expect(getCookie('test1')).toBe('value1');
    expect(getCookie('test2')).toBe('value2');
    expect(getCookie('test3')).toBe('value3');
  });

  it('should return null if cookie name is not found', () => {
    expect(getCookie('invalid')).toBeNull();
  });

  it('should handle empty cookie string', () => {
    document.cookie = '';
    expect(getCookie('test')).toBeNull();
  });

  it('should handle malformed cookie string', () => {
    document.cookie = 'invalidcookie';
    expect(getCookie('test')).toBeNull();
  });
});

describe('IsNoScheduleExist', () => {
  it('IsNoScheduleExist - empty availability array', () => {
    const selectedDay: Availability[] = [];

    const isScheduleExist = isNoScheduleExist(selectedDay);

    expect(isScheduleExist).toBe(false);
  });
  it('IsNoScheduleExist - availability array all unavailable', () => {
    const selectedDay: Availability[] = [
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: false,
        day: 'monday',
      },
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: false,
        day: 'tuesday',
      },
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: false,
        day: 'wednesday',
      },
      {
        startDate: '2024-03-18',
        endDate: '2024-03-18',
        type: 'override',
        isAvailable: false,
        day: 'monday',
      },
    ];

    const isScheduleExist = isNoScheduleExist(selectedDay);

    expect(isScheduleExist).toBe(false);
  });
  it('IsNoScheduleExist - availability array all are not unavailable', () => {
    const selectedDay: Availability[] = [
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: true,
        day: 'monday',
      },
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: false,
        day: 'tuesday',
      },
      {
        startDate: null,
        endDate: null,
        type: 'default',
        isAvailable: true,
        day: 'wednesday',
      },
      {
        startDate: '2024-03-19',
        endDate: '2024-03-19',
        type: 'override',
        isAvailable: true,
        day: 'tuesday',
      },
    ];

    const isScheduleExist = isNoScheduleExist(selectedDay);

    expect(isScheduleExist).toBe(true);
  });
});

describe('localStorage related methods', () => {
  it('saveIntegrationInfo', () => {
    const integrationInfo: GoogleIntegrationInfo = {
      integrationMode: 'client-booking',
      bookingProductId: '123',
    };

    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();

    saveIntegrationInfo(integrationInfo);

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('getIntegrationInfo', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn();
    getIntegrationInfo();
    expect(localStorage.getItem).toHaveBeenCalled();
  });

  it('saveBookingSnapshot', () => {
    const bookingSnapshot: any = {};

    jest.spyOn(Storage.prototype, 'setItem');
    Storage.prototype.setItem = jest.fn();

    saveBookingSnapshot(bookingSnapshot);

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('getBookingSnapshot', () => {
    jest.spyOn(Storage.prototype, 'getItem');
    Storage.prototype.getItem = jest.fn();
    getBookingSnapshot();
    expect(localStorage.getItem).toHaveBeenCalled();
  });
});
