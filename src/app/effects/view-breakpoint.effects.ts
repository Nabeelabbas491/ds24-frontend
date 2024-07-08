import { Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import * as actions from '../store/actions';
import { map } from 'rxjs';
import { BreakpointObserver, BreakpointState, Breakpoints } from '@angular/cdk/layout';
import { getBreakPoint } from '../shared/common/util';

@Injectable()
export class ViewBreakPointEffects {
  constructor(private breakpointObserver: BreakpointObserver) {}

  breakPointSmall$ = this.breakpointObserver.observe([
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge,
  ]);

  setBreakPoint$ = createEffect(() =>
    this.breakPointSmall$.pipe(
      map((result: BreakpointState) => {
        return actions.viewBreakPoint.setBreakPoint({ breakPoint: getBreakPoint(result) });
      }),
    ),
  );
}
