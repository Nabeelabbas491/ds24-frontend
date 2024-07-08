import { reducer, actions, selectors, State } from './notification.store';

const initialState: State = {
  snackBarMessage: '',
};

describe('Notification Reducer', () => {
  it('should return the default state', () => {
    const action = {} as any;

    const result = reducer(undefined, action);
    expect(result).toEqual(initialState);
  });
  it('should handle callSnackBarPopup action', () => {
    const snackBarMessage = 'some message';
    const action = actions.callSnackBarPopup({ snackBarMessage });
    const state = reducer(initialState, action);
    expect(state.snackBarMessage).toEqual(snackBarMessage);
  });
});

describe('Notification selectors', () => {
  it('should select tab view', () => {
    const result = selectors.selectSnackBarMessage.projector(initialState);
    expect(result).toBe(initialState.snackBarMessage);
  });
});
