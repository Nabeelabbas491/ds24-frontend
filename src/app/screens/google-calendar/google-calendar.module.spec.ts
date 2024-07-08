import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GoogleCalendarModule } from './google-calendar.module';
import { ButtonModule, DsSpinnerModule, IconModule, MessageModule } from '@ds24/elements';

describe('GoogleCalendarModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([]), GoogleCalendarModule],
    });
  });

  it('should import required modules', () => {
    TestBed.configureTestingModule({
      imports: [ButtonModule, IconModule, MessageModule, DsSpinnerModule],
    });
    const module = TestBed.inject(GoogleCalendarModule);
    expect(module).toBeTruthy();
  });
});
