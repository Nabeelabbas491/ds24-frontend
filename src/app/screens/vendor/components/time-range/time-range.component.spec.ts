import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRangeComponent } from './time-range.component';
import { FormArray, FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import { ScheduleFormServiceModule } from '../../../../services/schedule-form.service.module';

describe('TimeRangeComponent', () => {
  let component: TimeRangeComponent;
  let fixture: ComponentFixture<TimeRangeComponent>;
  let fb: FormBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeRangeComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ReactiveFormsModule,
        ScheduleFormServiceModule,
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore(), FormBuilder],
    });
    fixture = TestBed.createComponent(TimeRangeComponent);
    component = fixture.componentInstance;
    fb = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle valid time ranges', () => {
    const timeRangeArray = new FormArray([
      fb.group({ from: new FormControl('09:00'), to: new FormControl('10:00') }),
      fb.group({ from: new FormControl('10:30'), to: new FormControl('11:30') }),
      fb.group({ from: new FormControl('12:00'), to: new FormControl('13:00') }),
    ]);

    component.timeRangeArray = timeRangeArray;

    expect(component.timeRangeArray.controls.every(control => control.touched === false)).toBe(true);

    component.changeOfInputValues();

    expect(component.timeRangeArray.controls.every(control => control.touched)).toBe(true);
  });
});
