import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentTabComponent } from './appointment-tab.component';
import { TranslateFakeLoader, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMockPipe } from './../../../../shared/pipes/translate-mock.pipe';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';
import { State, selectors, actions } from '../../../../store';
import { cold, getTestScheduler } from 'jasmine-marbles';

describe('AppointmentTabComponent', () => {
  let component: AppointmentTabComponent;
  let fixture: ComponentFixture<AppointmentTabComponent>;
  let mockStore: MockStore<State>;
  let selectTabView: MemoizedSelector<State, boolean>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentTabComponent, TranslateMockPipe],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [provideMockStore()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(AppointmentTabComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    jest.spyOn(mockStore, 'dispatch');

    selectTabView = mockStore.overrideSelector(selectors.vendor.selectTabView, false);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select the set value as isListView$', () => {
    const expectedValue = false;
    getTestScheduler().flush();

    const marbles = 'a';
    const values = { a: expectedValue };

    selectTabView.setResult(expectedValue);

    const isListView$ = cold(marbles, values);
    expect(component.isListView$).toBeObservable(isListView$);
  });

  it('should dispatch the action on change of view', () => {
    const tabView = true;
    component.changeAppoinmentView(tabView);

    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.saveTabView({ tabView }));
  });

  it('should call the action to navigate to manage schedule page ', () => {
    component.openManageSchedule();
    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.vendor.redirectToManageSchedulePage());
  });
});
