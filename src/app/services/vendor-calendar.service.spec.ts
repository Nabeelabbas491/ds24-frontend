import { TestBed } from '@angular/core/testing';
import { VendorCalendarService } from './vendor-calendar.service';
import { HttpClient } from '@angular/common/http';
import { appointmentListData, sampleMonthData } from '../types/vendor.types.mock';
import { of } from 'rxjs';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';
import { eachDayOfInterval, endOfMonth, endOfWeek, parse, startOfWeek } from 'date-fns';
import { getDaysInMonthsData } from '../shared/common/util';

describe('VendorCalendarService', () => {
  let service: VendorCalendarService;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VendorCalendarService],
    });

    service = TestBed.inject(VendorCalendarService);
    http = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });

  it('should call setCurrMonth with the correct argument when getNextMonth is invoked', () => {
    const setCurrMonthSpy = jest.spyOn(service, 'setCurrMonth').mockReturnValue(of({ days: [], total: 0 }));

    service.currMonth = 'Jan-2023';

    service.getNextMonth().subscribe();

    const expectedNextMonth = 'Feb-2023';
    expect(setCurrMonthSpy).toHaveBeenCalledWith(expectedNextMonth);
  });

  it('should call setCurrMonth with the correct argument when getPrevMonth is invoked', () => {
    const setCurrMonthSpy = jest.spyOn(service, 'setCurrMonth').mockReturnValue(of({ days: [], total: 0 }));

    service.currMonth = 'Feb-2023';

    service.getPrevMonth().subscribe();

    const expectedPrevMonth = 'Jan-2023';
    expect(setCurrMonthSpy).toHaveBeenCalledWith(expectedPrevMonth);
  });

  it('should call the appointmentList data', (done: any) => {
    const appointmentLists = of(appointmentListData);
    jest.spyOn(http, 'get').mockReturnValue(of(appointmentListData));

    service.getAppointmentCalendarData = jest.fn(() => appointmentLists);
    const month = 1;
    const year = 2023;

    service.getAppointmentCalendarData(month, year).subscribe(appointments => {
      expect(appointments).toEqual(appointmentListData);
      done();
    });
  });

  it('should set first day of month', done => {
    const firstDay = service.firstDayOfMonth;
    service.setFirstDayOfMonth().subscribe(result => {
      expect(result).toEqual(firstDay.toJSON());
      done();
    });
  });

  it('should set days with events data correctly', () => {
    const mockCurrMonth = 'Dec-2023';
    const mockAppointmentsData = sampleMonthData;

    service.currMonth = mockCurrMonth;
    service.firstDayOfMonth = parse(mockCurrMonth, 'MMM-yyyy', new Date());
    service.appointmentsData = appointmentListData.appointments;

    const firstMondayOfMonth = startOfWeek(service.firstDayOfMonth, { weekStartsOn: 1 });
    const lastSundayOfMonth = endOfWeek(endOfMonth(service.firstDayOfMonth), { weekStartsOn: 1 });

    const allDaysInMonthOfAllWeeks = eachDayOfInterval({ start: firstMondayOfMonth, end: lastSundayOfMonth });

    const daysWithEventsData = getDaysInMonthsData(
      allDaysInMonthOfAllWeeks,
      service.appointmentsData,
      service.firstDayOfMonth,
    );

    jest.spyOn(service, 'setDaysWithEventsData').mockReturnValue(mockAppointmentsData);

    const result = service.setDaysWithEventsData();
    const expectedFirstDayOfMonth = parse(mockCurrMonth, 'MMM-yyyy', new Date());

    expect(result).toBeDefined();
    expect(service.firstDayOfMonth).toBeDefined();
    expect(service.firstDayOfMonth).toEqual(expectedFirstDayOfMonth);
    expect(result.length).toBeGreaterThan(0);
    expect(daysWithEventsData).toEqual(mockAppointmentsData);
  });

  it('should get the calendar data when populateInitialCalendarDays is invoked', () => {
    const appointmentLists = of(appointmentListData);

    service.populateInitialCalendarDays().subscribe();

    const month = service.today.getMonth() + 1;
    const year = service.today.getFullYear();

    const apiUrl = `${environment.apiUrl}/appointments/list?month=${month}&year=${year}`;

    const request = httpTestingController.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.urlWithParams).toBe(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(appointmentLists);
  });

  it('should get the calendar data when setCurrMonth is invoked', () => {
    const appointmentLists = of(appointmentListData);

    const monthInString = 'Jan 2023';

    service.setCurrMonth(monthInString).subscribe();

    const apiUrl = `${environment.apiUrl}/appointments/list?month=${service.selectedMonth}&year=${service.selectedYear}`;

    const request = httpTestingController.expectOne(apiUrl);

    expect(request).toBeDefined();
    expect(request.request.urlWithParams).toBe(apiUrl);
    expect(request.request.method).toBe('GET');
    request.flush(appointmentLists);
  });
});
