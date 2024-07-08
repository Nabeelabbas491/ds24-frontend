import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ReactiveLifecycles } from '@ds24/utilities';
import { map, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectors } from './../../../../store';
import { MeetingType } from './../../../../types/misc.type';

@Component({
  selector: 'ds-booking-type-selection',
  templateUrl: './booking-type-selection.component.html',
})
export class BookingTypeSelectionComponent extends ReactiveLifecycles {
  form!: FormGroup;

  @Input()
  meetingType: MeetingType | null = null;

  @Output()
  meetingTypeChange: EventEmitter<MeetingType> = new EventEmitter<MeetingType>();

  meetingTypes$ = this.store.select(selectors.bookingAPI.selectBookingMeetingTypes);

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    super();
  }
  ngOnInit() {
    super.ngOnInit();

    this.form = this.fb.group({
      meetingType: new FormControl(this.meetingType?.id),
    });

    this.formControls.meetingType.valueChanges
      .pipe(
        switchMap(meetingTypeId =>
          this.meetingTypes$.pipe(map(meetingTypes => meetingTypes?.find(mt => mt.id === meetingTypeId))),
        ),
        takeUntil(this.ngOnDestroy$),
      )
      .subscribe((meetingType: MeetingType) => {
        this.meetingTypeChange.emit(meetingType);
      });
  }

  get formControls(): any {
    return this.form.controls;
  }
}
