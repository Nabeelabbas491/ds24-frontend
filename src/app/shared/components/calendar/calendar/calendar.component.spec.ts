import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarComponent } from './calendar.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions, selectors } from '../../../../store';
import { TranslateModule } from '@ngx-translate/core';
import { MemoizedSelector } from '@ngrx/store';
import { CalendarCellComponent } from './calendar-cell/calendar-cell.component';
import { IconModule } from '@ds24/elements';

describe('CalendarComponent', () => {
  let fixture: ComponentFixture<CalendarComponent>;
  let instance: CalendarComponent;
  let mockStore: MockStore<State>;
  let selectCalendarCurrentMonth: MemoizedSelector<State, string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarComponent, CalendarCellComponent],
      providers: [provideMockStore()],
      imports: [TranslateModule.forRoot(), IconModule],
    });
    fixture = TestBed.createComponent(CalendarComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    fixture.detectChanges();

    selectCalendarCurrentMonth = mockStore.overrideSelector(selectors.calendar.selectCalendarCurrentMonth, 'Sept-2023');

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should dispatch a calendar.nextMonth action when nextMonth is called', () => {
    selectCalendarCurrentMonth.setResult('Oct-2023');

    const action = actions.calendar.nextMonth();

    instance.nextMonth();

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a calendar.prevMonth action when prevMonth is called', () => {
    selectCalendarCurrentMonth.setResult('Aug-2023');

    const action = actions.calendar.prevMonth();

    instance.prevMonth();

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
