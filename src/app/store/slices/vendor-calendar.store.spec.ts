import { reducer, initialState, actions, selectors } from './vendor-calendar.store';

describe('Vendor Calendar Reducers', () => {
  it('should set firstDayOfMonth on setFirstDayOfMonthSuccess', () => {
    const firstDayOfMonth = '2023-11-01';
    const action = actions.setFirstDayOfMonthSuccess({ firstDayOfMonth });
    const state = reducer(initialState, action);

    expect(state.firstDayOfMonth).toEqual(firstDayOfMonth);
  });

  it('should set the pending state on setFirstDayOfMonth', () => {
    const action = actions.setFirstDayOfMonth();
    const state = reducer(initialState, action);
    expect(state.pending).toEqual(true);
  });

  it('should set the pending state on getPrevMonth', () => {
    const action = actions.getPrevMonth();
    const state = reducer(initialState, action);
    expect(state.pending).toEqual(true);
  });

  it('should set the pending state on getNextMonth', () => {
    const action = actions.getNextMonth();
    const state = reducer(initialState, action);
    expect(state.pending).toEqual(true);
  });

  it('should set daysWithEventsData on setDaysWithEventsDataSuccess', () => {
    const daysWithEventsData = [{ date: new Date(), eventIndex: 0, eventsData: [], isSameMonth: false }];
    const action = actions.setDaysWithEventsDataSuccess({ daysWithEventsData });
    const state = reducer(initialState, action);

    expect(state.daysWithEventsData).toEqual(daysWithEventsData);
  });
});

describe('Vendor Calendar Selectors', () => {
  it('should update the selectedDaysWithEventsData', () => {
    const result = selectors.selectDaysWithEventsData.projector(initialState);
    expect(result).toEqual(initialState.daysWithEventsData);
  });

  it('should update the firstDayOfMonth', () => {
    const result = selectors.selectFirstDayOfMonth.projector(initialState);
    expect(result).toEqual(initialState.firstDayOfMonth);
  });
});
