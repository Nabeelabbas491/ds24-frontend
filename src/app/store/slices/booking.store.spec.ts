import { State, actions, initialState, reducer, selectors } from './booking.store';
import { Day } from './../../types/calendar-day.type';
import { BookingSnapshot } from 'src/app/types/booking.type';

describe('Booking Reducer', () => {
  it('should handle getBookingTemplate action', () => {
    const mockDay: Day = {
      number: 24,
      isToday: false,
      isSelected: false,
      isOtherMonth: false,
      isPast: false,
      dayMonthYearTitle: '2024-02-24',
      isSelectable: true,
      slotsArr: [],
    };
    const state: State = {
      ...initialState,
      selectedDay: null,
      timeSlot: { startTime: '09:00', endTime: '09:30' },
      prevTimeSlot: { startTime: '09:00', endTime: '09:30' },
    };
    const newState = reducer(state, actions.selectDay({ day: mockDay }));

    expect(newState.selectedDay).toEqual(mockDay);
    expect(newState.timeSlot).toEqual(null);
    expect(newState.prevTimeSlot).toEqual(null);
  });
  it('should handle loadBookingSnapshot action', () => {
    const bookingSnapshot: BookingSnapshot = {
      currentStep: 'summary',
      selectedDay: {
        isOtherMonth: false,
        isPast: false,
        isSelectable: true,
        number: 28,
        dayMonthYearTitle: '2024-03-28',
        isToday: false,
        isSelected: true,
      },
      meetingType: { id: 1, name: 'Inbound' },
      timeZone: 'Islamabad/Karachi',
      prevTimeSlot: { startTime: '09:00', endTime: '09:30' },
      timeSlot: { startTime: '10:00', endTime: '10:30' },
      bookingTemplateSummary: { heading: 'test', duration: 30, userName: 'test', imageUrl: 'test.jpg' },
      isBookingSynced: false,
      bookingSaveSuccess: null,
    };
    const state: State = {
      ...initialState,
      isBookingSynced: false,
    };
    const newState = reducer(state, actions.loadBookingSnapshot({ bookingSnapshot }));
    expect(newState).toEqual(bookingSnapshot);
  });
  it('should handle isBookingSynced action', () => {
    const state: State = {
      ...initialState,
      isBookingSynced: false,
    };
    const newState = reducer(state, actions.isBookingSynced({ isBookingSynced: true }));
    expect(newState.isBookingSynced).toEqual(true);
  });
});
describe('Booking Selectors', () => {
  const mockState: State = {
    currentStep: 'summary',
    selectedDay: {
      isOtherMonth: false,
      isPast: false,
      isSelectable: true,
      number: 28,
      dayMonthYearTitle: '2024-03-28',
      isToday: false,
      isSelected: true,
    },
    meetingType: { id: 1, name: 'Inbound' },
    timeZone: 'Islamabad/Karachi',
    prevTimeSlot: { startTime: '09:00', endTime: '09:30' },
    timeSlot: { startTime: '10:00', endTime: '10:30' },
    bookingTemplateSummary: { heading: 'test', duration: 30, userName: 'test', imageUrl: 'test.jpg' },
    isBookingSynced: false,
    bookingSaveSuccess: null,
  };

  it('should select IsBookingSynced', () => {
    const selectedValue = selectors.selectIsBookingSynced.projector(mockState);
    expect(selectedValue).toEqual(mockState.isBookingSynced);
  });

  it('should select BookingSnapshot', () => {
    const selectedValue = selectors.selectBookingSnapshot.projector(mockState);
    expect(selectedValue).toEqual(mockState);
  });
});
