import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IconColor, IconName } from '@ds24/elements';
import { BreadcrumbItem } from '@ds24/elements/lib/breadcrumb/breadcrumb-item';
import {
  Availibility,
  TimeSlot,
  DayDetail,
  DEFAULT_SLOT_FROM,
  DEFAULT_SLOT_TO,
  FormDayDetail,
  EditOverrideDetails,
} from '../../../../types/vendor.types';
import { Store } from '@ngrx/store';
import { actions, selectors } from '../../../../store';
import { takeUntil } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';
import { format, parse } from 'date-fns';
import { MessageType } from '@ds24/elements';
import { TranslateService } from '@ngx-translate/core';
import { blankAvailabilities } from '../../../../types/vendor.types.mock';
import { CustomValidators } from '../../../../shared/common/custom-validator';

@Component({
  selector: 'ds-manage-schedule',
  templateUrl: './manage-schedule.component.html',
})
export class ManageScheduleComponent extends ReactiveLifecycles implements OnInit {
  items: BreadcrumbItem[] = [{ title: 'Appointments', url: '#/vendor' }, { title: 'Manage Schedule' }];
  icon: IconName = IconName.Plus;
  iconColor = IconColor.Neutral500;
  daysForm: FormGroup;
  daysFormArray!: FormArray;
  trash: IconName = IconName.Trash;
  spinnerColor = IconColor.Neutral500;
  MessageType = MessageType;
  isUnavailable$ = this.store.select(selectors.vendorSchedule.selectVendorIsUnavailable);
  overRideDays$ = this.store.select(selectors.vendorSchedule.selectOverrideDays);
  isPending$ = this.store.select(selectors.vendorSchedule.selectPending);
  isRemoveDateOveridePending$ = this.store.select(selectors.vendorSchedule.selectRemoveDateOveridePending);
  constructor(
    private fb: FormBuilder,
    public store: Store,
    private translateService: TranslateService,
  ) {
    super();
    this.daysForm = this.fb.group({
      days: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.store.dispatch(actions.timeZoneAPI.getTimeZones());
    this.store.dispatch(actions.vendorSchedule.loadVendorSchedule());
    this.store
      .select(selectors.vendorSchedule.selectVendorSchedule)
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe(days => {
        if (days.timeZone) {
          this.store.dispatch(actions.vendor.saveSelectedTimeZone({ selectedTimeZone: days.timeZone }));
        }

        this.daysFormArray = this.daysForm.get('days') as FormArray;
        this.daysFormArray.clear();
        if (days.availabilities.length === 0) {
          this.constructFormArray(blankAvailabilities);
          this.store.dispatch(actions.vendorSchedule.setIfUnavailable({ isUnavailable: true }));
        } else {
          this.constructFormArray(days.availabilities.filter(day => day.type === 'default'));
        }
      });
  }

  constructFormArray(availabilities: Availibility[]) {
    availabilities.forEach(day => {
      const parsedDate = parse(day.day as string, 'EEEE', new Date());
      const shortWeekDay = format(parsedDate, 'EEE', { useAdditionalDayOfYearTokens: false });

      const slots: TimeSlot[] = [];

      day.slot.forEach(slot => {
        const daySlot: TimeSlot = {
          from: slot.from ? slot.from : DEFAULT_SLOT_FROM,
          to: slot.to ? slot.to : DEFAULT_SLOT_TO,
        };
        slots.push(daySlot);
      });

      const dayDetail: DayDetail = {
        dayOfWeek: shortWeekDay.toUpperCase(),
        selected: day.slot.length > 0 ? true : false,
        unavailable: day.slot.length > 0 ? false : true,
        slot: [...slots],
      };
      const dayFormGroup = this.createDayFormGroup(dayDetail);
      this.daysFormArray.push(dayFormGroup);
    });
  }

  createDayFormGroup(day: DayDetail): FormGroup {
    const newDayForm = this.fb.group({
      dayOfWeek: day.dayOfWeek,
      selected: day.selected,
      unavailable: day.unavailable,
      timeRange: this.fb.array([], [CustomValidators.validateTimeRange()]),
    });

    day.slot.forEach(slot => {
      const slotFormGroup = this.fb.group(
        {
          from: new FormControl(slot.from),
          to: new FormControl(slot.to),
        },
        [CustomValidators.isStartMore()],
      );

      (newDayForm.get('timeRange') as FormArray).push(slotFormGroup);
    });

    return newDayForm;
  }
  get getDayControls() {
    return (this.daysForm.get('days') as FormArray).controls;
  }

  getDayFormGroup(index: number) {
    return (this.daysForm.get('days') as FormArray).get(index.toString()) as FormGroup;
  }

  openOverrideModal() {
    this.store.dispatch(actions.vendorSchedule.setUpdateOverrideDetails({ updateOverrideIndex: null }));
    this.store.dispatch(actions.calendar.navigateToMonth({ currentMonth: format(new Date(), 'yyyy-MM-dd') }));
    this.store.dispatch(actions.vendor.setAddOverrideModalVisibilityStatus({ addOverrideModal: true }));
  }

  removeSelectedOveride(index: number | undefined) {
    if (index) {
      this.store.dispatch(actions.vendorSchedule.setRemoveDateOveridePendingStatus({ isPending: true }));
      this.store.dispatch(actions.vendorSchedule.removeSelectedOverride({ index }));
    }
  }

  saveSchedule() {
    if (this.daysForm.valid) {
      const days: FormDayDetail[] = this.daysForm.getRawValue().days;
      this.store.dispatch(actions.vendorSchedule.saveVendorScheduleForm({ daysFormValue: days }));
    } else {
      this.store.dispatch(
        actions.vendorSchedule.showInvalidFormError({
          formError: this.translateService.instant('VENDOR.SCHEDULE.INVALID_FORM_ERROR'),
        }),
      );
    }
  }

  openEditSchedule(
    startDate: string | null,
    endDate: string | null,
    slots: TimeSlot[],
    updateIndex: number | undefined,
  ) {
    const editSheduleDetails: EditOverrideDetails = {
      startDate: startDate,
      endDate: endDate,
      slots: slots,
      updateIndex: updateIndex,
    };

    this.store.dispatch(actions.vendorSchedule.editOverrideSchedule({ editSheduleDetails }));
  }

  cancelSchedule() {
    this.store.dispatch(actions.vendorSchedule.loadVendorSchedule());
  }
}
