import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSelectionComponent } from './time-selection.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State, actions } from '../../../../store';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { DropdownModule, DsChipsModule, DsFormsModule, IconModule } from '@ds24/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('TimeSelectionComponent', () => {
  let fixture: ComponentFixture<TimeSelectionComponent>;
  let instance: TimeSelectionComponent;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSelectionComponent],
      imports: [
        TranslateModule.forRoot(),
        PipesModule,
        IconModule,
        DsFormsModule,
        DropdownModule,
        DsChipsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(TimeSelectionComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should dispatch a select time slot action', () => {
    instance.selectTimeSlot({ startTime: '10:00', endTime: '10:30' });

    const action = actions.booking.timeSlot({ timeSlot: { startTime: '10:00', endTime: '10:30' } });

    expect(mockStore.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch select time zone action if time zone is selected', () => {
    const timeZoneDetail = {
      timeZone: '(GMT+05:00) Karachi',
    };

    instance.form.setValue(timeZoneDetail);

    expect(mockStore.dispatch).toHaveBeenCalledWith(actions.booking.timeZone({ timeZone: timeZoneDetail.timeZone }));
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
