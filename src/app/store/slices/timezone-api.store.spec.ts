import { reducer, initialState, actions, selectors } from './timezone-api.store';

describe('TimeZone Reducer', () => {
  it('should handle get timeZones action', () => {
    const timeZones: string[] = [];
    const state = reducer(initialState, actions.getTimeZones());
    expect(state.timeZones).toEqual(timeZones);
  });

  it('should handle api Error', () => {
    const error = '401 Unauthorized';
    const action = actions.getTimeZonesFailure({ error });
    const state = reducer(initialState, action);
    expect(state.timeZonesError).toBe(error);
  });
});

describe('TimeZone Selectors', () => {
  it('should select list of timeZones', () => {
    const selectedValue = selectors.selectTimeZones.projector(initialState);
    expect(selectedValue).toEqual(initialState.timeZones);
  });

  it('should select timezones pending state during api call', () => {
    const selectedValue = selectors.selectTimeZonesPending.projector(initialState);
    expect(selectedValue).toBe(initialState.timeZonesPending);
  });

  it('should select error of timezones api failure', () => {
    const selectedValue = selectors.selectTimeZonesError.projector(initialState);
    expect(selectedValue).toBe(initialState.timeZonesError);
  });
});
