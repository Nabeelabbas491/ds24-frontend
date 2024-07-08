import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as actions from './../store/actions';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';
import { VendorService } from '../services/vendor.service';
import { DsSnackbarService } from '@ds24/elements';
import { selectors } from '../store';
import { Store } from '@ngrx/store';

@Injectable()
export class VendorBookingTemplateEffects {
  createEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorBookingTemplate.openCreateBookingModal, actions.vendorBookingTemplate.openEditBookingModal),
      map(action => {
        if (action.type === actions.vendorBookingTemplate.openEditBookingModal.type) {
          return actions.vendorBookingTemplate.getCollection({ bookingTemplateId: action.bookingTemplateId });
        }
        return actions.vendorBookingTemplate.getCollection({ bookingTemplateId: undefined });
      }),
    ),
  );

  getBookingTemplateList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorBookingTemplate.getBookingTemplateList),
      withLatestFrom(this.store.select(selectors.vendorBookingTemplate.selectBookingTemplateListCurrentPage)),
      switchMap(([, currentPage]) =>
        this.vendorService.getBookingTemplateList(currentPage).pipe(
          map(bookingTemplateList =>
            actions.vendorBookingTemplate.getBookingTemplateListSuccess({ bookingTemplateList }),
          ),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorBookingTemplate.getBookingTemplateListFailure({ error }));
          }),
        ),
      ),
    ),
  );

  setBookingTemplateListCurrentPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorBookingTemplate.setBookingTemplateListCurrentPage),
      map(() => {
        return actions.vendorBookingTemplate.getBookingTemplateList();
      }),
    ),
  );

  getTemplateFormCollection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorBookingTemplate.getCollection),
      map(action => {
        return action.bookingTemplateId;
      }),
      switchMap(bookingTemplateId =>
        this.vendorService.getBookingTemplateCollection(bookingTemplateId).pipe(
          map(bookingTemplateCollection =>
            actions.vendorBookingTemplate.getCollectionSuccess({ bookingTemplateCollection }),
          ),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorBookingTemplate.getCollectionFailure({ error }));
          }),
        ),
      ),
    ),
  );

  upsertBookingTemplate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(actions.vendorBookingTemplate.upsertBookingTemplate),
      map(action => {
        return { bookingTemplateId: action.bookingTemplateId, saveBookingTemplate: action.saveBookingTemplate };
      }),
      switchMap(({ bookingTemplateId, saveBookingTemplate }) => {
        let upsertBookingTemplate$ = this.vendorService.insertBookingTemplate(saveBookingTemplate);
        if (bookingTemplateId) {
          upsertBookingTemplate$ = this.vendorService.updateBookingTemplate(bookingTemplateId, saveBookingTemplate);
        }
        return upsertBookingTemplate$.pipe(
          map(response => {
            this.snackbarService.openSnackbar({ title: response.message, type: 'info' });
            return actions.vendorBookingTemplate.upsertBookingTemplateSuccess({ success: response.message });
          }),
          catchError(error => {
            this.snackbarService.openSnackbar({ title: error, type: 'error' });
            return of(actions.vendorBookingTemplate.upsertBookingTemplateFailure({ error: error }));
          }),
        );
      }),
    ),
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private vendorService: VendorService,
    private snackbarService: DsSnackbarService,
  ) {}
}
