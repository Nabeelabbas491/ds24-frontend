import { Component, ElementRef, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, takeUntil } from 'rxjs';
import * as actions from '../../../../store/actions';
import * as selectors from '../../../../store/selectors';
import { IconColor } from '@ds24/elements';
import { AppointmentListParams } from 'src/app/types/vendor.types';
import { ReactiveLifecycles } from '@ds24/utilities';

@Component({
  selector: 'ds-appointment-tab',
  templateUrl: './appointment-tab.component.html',
  styleUrls: ['./appointment-tab.component.scss'],
})
export class AppointmentTabComponent extends ReactiveLifecycles {
  isListView$: Observable<boolean> = this._store.select(selectors.vendor.selectTabView);
  pageCount$ = this._store.select(selectors.vendorAppointment.selectListPageCount);
  pageSize$ = this._store.select(selectors.vendorAppointment.selectListLimit);
  appointmentCount$ = this._store.select(selectors.vendorAppointment.selectAppointmentCount);
  calendarAppointmentCount$ = this._store.select(selectors.vendorAppointment.selectCalendarAppointmentCount);
  appointmentsPending$ = this._store.select(selectors.vendorAppointment.selectPending);
  spinnerColor = IconColor.Primary300;
  listParams: AppointmentListParams = {};
  @ViewChild('headerSection') headerSection: ElementRef | null = null;

  constructor(private _store: Store) {
    super();
    this._store
      .select(selectors.vendorAppointment.selectListParams)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(listParamsStore => {
        this._store.dispatch(actions.vendorAppointment.loadAppointmentList({ listParams: listParamsStore }));
      });
  }
  changeAppoinmentView(tabView: boolean) {
    this._store.dispatch(actions.vendor.saveTabView({ tabView }));
  }

  openManageSchedule() {
    this._store.dispatch(actions.vendor.redirectToManageSchedulePage());
  }

  pageChange(page: number) {
    if (page > 0) {
      this._store.dispatch(actions.vendorAppointment.updateListParam({ paramName: 'page', paramValue: page }));
    }
  }
}
