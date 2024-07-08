import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDateOverrideComponent } from './add-date-override.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from '../../../../store';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ScheduleFormServiceModule } from '../../../../services/schedule-form.service.module';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';

describe('AddDateOverrideComponent', () => {
  let component: AddDateOverrideComponent;
  let fixture: ComponentFixture<AddDateOverrideComponent>;
  let mockStore: MockStore<State>;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ScheduleFormServiceModule,
      ],
      declarations: [AddDateOverrideComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), FormBuilder],
    });
    fixture = TestBed.createComponent(AddDateOverrideComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fb = TestBed.inject(FormBuilder);
    jest.spyOn(mockStore, 'dispatch');
    jest.spyOn(mockStore, 'select');

    jest.spyOn(component, 'cancelOverrideModal');
    jest.spyOn(component.getTimeRangeArray, 'clear').mockImplementation(() => {});
    jest.spyOn(component.overideDaysForm, 'reset').mockImplementation(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the overrideDaysForm form group', () => {
    expect(component.overideDaysForm).toBeDefined();
    expect(component.overideDaysForm.controls.timeRange).toBeDefined();
  });

  it('should dispatch saveOverRideDays action with isUnavailable true when getOverRideDayControls is empty', () => {
    component.getOverRideDayControls;

    component.overideDaysForm = fb.group({
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' })]),
    });

    component.saveOverrides();

    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendorSchedule.saveOverrideForm({
        timeSlots: [{ from: '09:00', to: '10:00' }],
      }),
    );

    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendorSchedule.saveDateOverride());
    expect(component.cancelOverrideModal).toHaveBeenCalled();
  });

  it('should increment time ranges', () => {
    component.overideDaysForm = fb.group({
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    component.appendTimeRanges();

    const timeRangeArray = component.overideDaysForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(3);

    const lastTimeRange = timeRangeArray.at(2).value;
    expect(lastTimeRange.from).toBe('12:00');
    expect(lastTimeRange.to).toBe('13:00');
  });

  it('should remove a time range', () => {
    component.overideDaysForm = fb.group({
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    component.removeTimeRanges(1);

    const timeRangeArray = component.overideDaysForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(1);
  });

  it('should reset the form, clear the time range array, and dispatch setAddOverrideModalVisibilityStatus action with false', () => {
    component.cancelOverrideModal();

    expect(component.getTimeRangeArray.clear).toHaveBeenCalled();
    expect(component.overideDaysForm.reset).toHaveBeenCalled();
    expect(mockStore.dispatch).toHaveBeenCalledWith(
      actions.vendor.setAddOverrideModalVisibilityStatus({ addOverrideModal: false }),
    );
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.calendar.resetSelectedDays());
  });
});
