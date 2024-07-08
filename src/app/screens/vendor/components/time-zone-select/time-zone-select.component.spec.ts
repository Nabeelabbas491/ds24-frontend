import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TimeZoneSelectComponent } from './time-zone-select.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MemoizedSelector } from '@ngrx/store';
import { State, actions, selectors } from '../../../../store';
import { cold } from 'jasmine-marbles';

describe('TimeZoneSelectComponent', () => {
  let component: TimeZoneSelectComponent;
  let fixture: ComponentFixture<TimeZoneSelectComponent>;
  let mockStore: MockStore<State>;
  let selectSelectedTimeZone: MemoizedSelector<State, string>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeZoneSelectComponent],
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
    fixture = TestBed.createComponent(TimeZoneSelectComponent);
    component = fixture.componentInstance;

    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'select');

    selectSelectedTimeZone = mockStore.overrideSelector(selectors.vendor.selectSelectedTimeZone, '');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the selector for loading initial timezone', () => {
    const mockSelectedTimeZone = 'America/New_York';
    selectSelectedTimeZone.setResult(mockSelectedTimeZone);
    const expected = cold('a--', { a: mockSelectedTimeZone });
    expect(component.selectedTimeZone$).toBeObservable(expected);
  });

  it('should dispatch an action when the timezoneSelect value changes', () => {
    const mockSelectedTimeZone = 'America/New_York';

    const dispatchSpy = jest.spyOn(mockStore, 'dispatch');

    mockStore.overrideSelector(selectors.vendor.selectSelectedTimeZone, mockSelectedTimeZone);

    component.timeZonesForm.get('timezoneSelect')?.setValue(mockSelectedTimeZone);

    expect(dispatchSpy).toHaveBeenCalledWith(
      actions.vendor.saveSelectedTimeZone({ selectedTimeZone: mockSelectedTimeZone }),
    );
  });
});
