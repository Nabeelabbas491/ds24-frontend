import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCellComponent } from './calendar-cell.component';
import { TranslateModule } from '@ngx-translate/core';
import { Day } from './../../../../../types/calendar-day.type';

describe('CalendarCellComponent', () => {
  let fixture: ComponentFixture<CalendarCellComponent>;
  let instance: CalendarCellComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarCellComponent],
      imports: [TranslateModule.forRoot()],
    });
    fixture = TestBed.createComponent(CalendarCellComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('calendar cell has day selected output property', () => {
    expect(instance).toHaveProperty('daySelected');
  });

  it('selectDay method exists on instance', () => {
    expect(instance.selectDay).toBeTruthy();
  });

  it('selectDay method emits selectedDay value', () => {
    const dayObj: Day = {
      number: 25,
      isToday: true,
      isSelected: true,
      isOtherMonth: false,
      isSelectable: true,
      isPast: false,
      dayMonthYearTitle: '25-Oct-2023',
    };

    jest.spyOn(instance.daySelected, 'emit');

    instance.dayObj = dayObj;
    instance.selectDay();
    fixture.detectChanges();
    expect(instance.daySelected.emit).toHaveBeenLastCalledWith(dayObj);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
