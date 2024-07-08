import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTypeSelectionComponent } from './booking-type-selection.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { State } from '../../../../store';
import { TranslateModule } from '@ngx-translate/core';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { DsFormsModule, IconModule } from '@ds24/elements';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('BookingTypeSelectionComponent', () => {
  let fixture: ComponentFixture<BookingTypeSelectionComponent>;
  let instance: BookingTypeSelectionComponent;
  let mockStore: MockStore<State>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingTypeSelectionComponent],
      imports: [TranslateModule.forRoot(), PipesModule, IconModule, DsFormsModule, FormsModule, ReactiveFormsModule],
      providers: [provideMockStore()],
    });
    fixture = TestBed.createComponent(BookingTypeSelectionComponent);
    instance = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);

    fixture.detectChanges();

    jest.spyOn(mockStore, 'dispatch');
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
