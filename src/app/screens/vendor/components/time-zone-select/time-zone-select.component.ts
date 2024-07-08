import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { actions, selectors } from '../../../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ReactiveLifecycles } from '@ds24/utilities';
import { takeUntil } from 'rxjs';
import { guessDefaultTimezone } from '../../../../shared/common/util';

@Component({
  selector: 'ds-time-zone-select',
  templateUrl: './time-zone-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeZoneSelectComponent extends ReactiveLifecycles implements OnInit {
  timeZones$ = this.store.select(selectors.timeZoneAPI.selectTimeZones);
  placeHolderTimeZone$ = this.store.select(selectors.vendor.selectPlaceholderTimeZone);
  defaultTimeZone: string = guessDefaultTimezone();
  selectedTimeZone$: Observable<string> = this.store.select(selectors.vendor.selectSelectedTimeZone);
  timeZonesForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    super();
    this.timeZonesForm = this.fb.group({
      timezoneSelect: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.timeZonesFormControls.timezoneSelect.valueChanges
      .pipe(takeUntil(this.ngOnDestroy$))
      .subscribe((selectedTimeZone: string) => {
        this.store.dispatch(actions.vendor.saveSelectedTimeZone({ selectedTimeZone }));
      });
  }

  get timeZonesFormControls() {
    return this.timeZonesForm.controls;
  }
}
