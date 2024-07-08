import { NotificationEffects } from './notification.effects';
import { Observable, of } from 'rxjs';
import { DsSnackbarService } from '@ds24/elements';
import { provideMockActions } from '@ngrx/effects/testing';
import { TestBed } from '@angular/core/testing';
import { actions } from '../store';
import { Actions } from '@ngrx/effects';

describe('NotificationEffects', () => {
  let effects: NotificationEffects;
  let actions$: Observable<any>;
  let _snackbarService: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationEffects,
        {
          provide: DsSnackbarService,
          useValue: { openSnackbar: jest.fn() },
        },
        provideMockActions(() => actions$),
      ],
    });

    _snackbarService = TestBed.inject(DsSnackbarService);
    effects = TestBed.inject(NotificationEffects);
    actions$ = TestBed.inject(Actions);
  });

  describe('loadSnackBar$', () => {
    it('should call the snackbar service when notification.callSnackBarPopup action is dispatched', (done: any) => {
      const snackBarMessage = 'Test Snackbar Message';
      const action = actions.notification.callSnackBarPopup({ snackBarMessage });
      actions$ = of(action);

      const expectedSnackbarConfig = {
        title: snackBarMessage,
        type: 'info',
        dismissAfterMs: 800,
      };

      effects.loadSnackBar$.subscribe(() => {
        expect(_snackbarService.openSnackbar).toHaveBeenCalledWith(expectedSnackbarConfig);
        done();
      });
    });
  });
});
