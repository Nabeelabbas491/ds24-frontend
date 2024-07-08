import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@ds24/elements';
import { BookingConfirmationComponent } from '../booking-confirmation/booking-confirmation.component';
import { provideMockStore } from '@ngrx/store/testing';
import { PipesModule } from '../../../../shared/pipes/pipes.module';
import { BookingConfirmationStepComponent } from './booking-confirmation-step.component';

describe('BookingConfirmationStepComponent', () => {
  let component: BookingConfirmationStepComponent;
  let fixture: ComponentFixture<BookingConfirmationStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingConfirmationStepComponent, BookingConfirmationComponent],
      providers: [provideMockStore()],
      imports: [TranslateModule.forRoot(), IconModule, PipesModule],
    });
    fixture = TestBed.createComponent(BookingConfirmationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
