import { initialState, reducer, selectors } from './vendor-schedule.store';
import { actions } from './vendor-schedule.store';

describe('Vendor Schedule Reducer', () => {
  it('should handle setSuccessMessage for removeDateOveride action', () => {
    const successMsg = 'success';
    const action = actions.setSuccessMessage({ SuccessMessage: successMsg });
    const state = reducer(initialState, action);
    expect(state).toBe(state);
  });

  it('should handle setRemoveDateOveridePendingStatus action', () => {
    const isPending = true;
    const action = actions.setRemoveDateOveridePendingStatus({ isPending: isPending });
    const state = reducer(initialState, action);
    expect(state).toBe(state);
  });

  it('should handle removeSelectedOverride action', () => {
    const index = 1;
    const action = actions.removeSelectedOverride({ index: index });
    const state = reducer(initialState, action);
    expect(state).toBe(state);
  });
});

describe('Vendor Schedule Selectors', () => {
  it('should select form', () => {
    const selectedValue = selectors.selectRemoveDateOveridePending.projector(initialState);
    expect(selectedValue).toEqual(initialState.isRemoveDateOveridePending);
  });
});
