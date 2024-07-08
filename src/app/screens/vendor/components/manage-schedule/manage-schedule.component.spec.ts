import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageScheduleComponent } from './manage-schedule.component';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, selectors } from '../../../../store';
import { MemoizedSelector } from '@ngrx/store';
import { Availibility, WeekSchedule } from '../../../../types/vendor.types';
import { weekSchedule } from '../../../../types/vendor.types.mock';

describe('ManageScheduleComponent', () => {
  let component: ManageScheduleComponent;
  let fixture: ComponentFixture<ManageScheduleComponent>;
  let mockStore: MockStore<State>;
  let selectVendorSchedule: MemoizedSelector<State, WeekSchedule>;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageScheduleComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), FormBuilder],
    });
    fixture = TestBed.createComponent(ManageScheduleComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'select');
    selectVendorSchedule = mockStore.overrideSelector(selectors.vendorSchedule.selectVendorSchedule, weekSchedule);
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the selector for loading initial data', () => {
    component.ngOnInit();
    expect(mockStore.select).toHaveBeenCalledWith(selectVendorSchedule);
    expect(component.daysFormArray.length).toEqual(weekSchedule.availabilities.length);
  });

  it('should create a day form group', () => {
    const dayDetail = {
      dayOfWeek: 'SAT',
      selected: false,
      unavailable: true,
      slot: [
        {
          from: '10:00',
          to: '19:00',
        },
      ],
    };

    const dayFormGroup = component.createDayFormGroup(dayDetail);

    expect(dayFormGroup.get('dayOfWeek')?.value).toBe(dayDetail.dayOfWeek);
    expect(dayFormGroup.get('selected')?.value).toBe(dayDetail.selected);
    expect(dayFormGroup.get('unavailable')?.value).toBe(dayDetail.unavailable);
    expect(dayFormGroup.get('timeRange'))?.toBeInstanceOf(FormArray);

    const timeRange = dayFormGroup.get('timeRange') as FormArray;
    expect(timeRange.length).toBe(1);
    expect(timeRange.at(0).get('from')?.value).toBe(dayDetail.slot[0].from);
    expect(timeRange.at(0).get('to')?.value).toBe(dayDetail.slot[0].to);
  });

  it('should get day controls from daysForm', () => {
    const dayControl1 = fb.group({
      dayOfWeek: 'Monday',
      selected: true,
      unavailable: false,
      timeRange: fb.array([
        fb.group({
          from: new FormControl('09:00 AM'),
          to: new FormControl('05:00 PM'),
        }),
      ]),
    });

    const dayControl2 = fb.group({
      dayOfWeek: 'Tuesday',
      selected: false,
      unavailable: true,
      timeRange: fb.array([
        fb.group({
          from: new FormControl('10:00 AM'),
          to: new FormControl('06:00 PM'),
        }),
      ]),
    });

    component.daysForm = fb.group({
      days: fb.array([dayControl1, dayControl2]),
    });

    const dayControls = component.getDayControls;

    expect(dayControls.length).toBe(2);
    expect(dayControls[0].get('dayOfWeek')?.value).toBe('Monday');
    expect(dayControls[1].get('dayOfWeek')?.value).toBe('Tuesday');
  });

  it('should create a form array with correct values', () => {
    component.daysFormArray.clear();

    const availabilities: Availibility[] = [
      {
        id: 1,
        startDate: null,
        endDate: null,
        type: 'default',
        day: 'monday',
        slot: [{ from: '09:00', to: '12:00' }],
      },
      {
        id: 2,
        startDate: null,
        endDate: null,
        type: 'default',
        day: 'tuesday',
        slot: [],
      },
    ];

    component.constructFormArray(availabilities);
    const formArray = component.daysFormArray;
    expect(formArray.length).toBe(availabilities.length);

    const formGroupValues = formArray.controls.map(control => control.value);
    expect(formGroupValues).toEqual([
      { dayOfWeek: 'MON', selected: true, unavailable: false, timeRange: [{ from: '09:00', to: '12:00' }] },
      { dayOfWeek: 'TUE', selected: false, unavailable: true, timeRange: [] },
    ]);
  });
});
