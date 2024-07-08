import { reducer, initialState, actions, selectors } from './view-breakpoint.store';

describe('View Break Point Store', () => {
  it('should handle setBreakPoint action', () => {
    const action = actions.setBreakPoint({ breakPoint: 'small' });
    const state = reducer(initialState, action);
    expect(state.breakPoint).toEqual('small');
  });

  it('should handle setBreakPoint action', () => {
    const action = actions.setBreakPoint({ breakPoint: 'small' });
    const state = reducer(initialState, action);
    const result = selectors.selectIsMobileView.projector(state);
    expect(result).toBe(true);
  });
});
