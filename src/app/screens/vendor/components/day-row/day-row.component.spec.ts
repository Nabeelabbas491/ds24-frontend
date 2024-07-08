import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRowComponent } from './day-row.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TimeRangeComponent } from './../time-range/time-range.component';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { DsFormsModule } from '@ds24/elements';
import { ScheduleFormServiceModule } from '../../../../services/schedule-form.service.module';

describe('DayRowComponent', () => {
  let component: DayRowComponent;
  let fixture: ComponentFixture<DayRowComponent>;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayRowComponent, TimeRangeComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        FormsModule,
        DsFormsModule,
        ScheduleFormServiceModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), FormBuilder],
    });
    fixture = TestBed.createComponent(DayRowComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should push a new time range', () => {
    component.dayForm = fb.group({
      unavailable: true,
      selected: false,
      timeRange: fb.array([]),
    });

    component.pushTimeRange();

    const timeRangeArray = component.dayForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(1);
    const newTimeRange = timeRangeArray.at(0).value;
    expect(newTimeRange.from).toBe('09:00');
    expect(newTimeRange.to).toBe('17:00');
  });

  it('should increment time ranges', () => {
    component.dayForm = fb.group({
      unavailable: false,
      selected: true,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    component.pushTimeRange();

    const timeRangeArray = component.dayForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(3);

    const lastTimeRange = timeRangeArray.at(2).value;
    expect(lastTimeRange.from).toBe('12:00');
    expect(lastTimeRange.to).toBe('13:00');
  });

  it('should remove a time range', () => {
    component.dayForm = fb.group({
      unavailable: false,
      selected: true,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    component.removeTimeRange(1);

    const timeRangeArray = component.dayForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(1);
  });

  it('should change day selection', () => {
    component.dayForm = fb.group({
      unavailable: false,
      selected: false,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    component.changeDaySelection({ target: { checked: true } });

    expect(component.dayForm.get('selected')?.value).toBe(true);

    const timeRangeArray = component.dayForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(2);
  });
});
