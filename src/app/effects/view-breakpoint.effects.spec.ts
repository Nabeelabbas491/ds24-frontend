import { ViewBreakPointEffects } from './view-breakpoint.effects';
import { TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { actions } from '../store';

export class MockBreakpointObserver {
  observe(breakPoint: string): Observable<BreakpointState> {
    if (breakPoint === 'small') {
      return of({ matches: true, breakpoints: { [Breakpoints.Small]: true } });
    }

    return of({ matches: false, breakpoints: {} });
  }
}

describe('ViewBreakPointEffects', () => {
  let effects: ViewBreakPointEffects;
  let breakpointObserver: MockBreakpointObserver;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewBreakPointEffects, { provide: BreakpointObserver, useClass: MockBreakpointObserver }],
    });
    effects = TestBed.inject(ViewBreakPointEffects);
    breakpointObserver = TestBed.inject(BreakpointObserver);
  });

  describe('setBreakPoint$', () => {
    it('should dispatch set breakpoint action when breakpoint observer observes a breakpoint change', (done: any) => {
      let action: Action | undefined;

      breakpointObserver.observe('small');

      effects.setBreakPoint$.subscribe(res => {
        action = res;
        expect(action).toBeDefined();
        expect(action).toHaveProperty('breakPoint');
        expect(action?.type).toBe(actions.viewBreakPoint.setBreakPoint.type);
        done();
      });
    });
  });
});
