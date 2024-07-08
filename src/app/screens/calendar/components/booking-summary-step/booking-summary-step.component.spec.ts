import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { BookingSummaryComponent } from '../booking-summary/booking-summary.component';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { provideMockStore } from '@ngrx/store/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookingSummaryStepComponent } from './booking-summary-step.component';

describe('BookingSummaryStepComponent', () => {
  let fixture: ComponentFixture<BookingSummaryStepComponent>;
  let instance: BookingSummaryStepComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingSummaryStepComponent, BookingFormComponent, BookingSummaryComponent],
      providers: [provideMockStore()],
      imports: [TranslateModule.forRoot(), PipesModule, FormsModule, ReactiveFormsModule],
    });
    fixture = TestBed.createComponent(BookingSummaryStepComponent);
    instance = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should compile', () => {
    fixture.detectChanges();
    expect(fixture).toMatchSnapshot();
  });

  it('should create', () => {
    expect(instance).toBeTruthy();
  });
});
