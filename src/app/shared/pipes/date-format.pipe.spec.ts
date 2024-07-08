import { TranslateModule } from '@ngx-translate/core';
import { TranslateService } from '@ngx-translate/core';
import { DateFormatPipe } from './date-format.pipe';
import { TestBed } from '@angular/core/testing';

const mockTranslateService = {
  instant: (arg: string) => {
    if (arg === 'CALENDAR.DAY_FORMAT_STRING.FULL') {
      return 'EEEE, LLLL dd, yyyy';
    }
    if (arg === 'CALENDAR.DAY_FORMAT_STRING.FULL_WITHOUT_YEAR') {
      return 'EEEE, LLLL dd';
    }
    return '';
  },
};

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DateFormatPipe, { provide: TranslateService, useValue: mockTranslateService }],
      imports: [TranslateModule.forRoot()],
    });
    pipe = TestBed.inject(DateFormatPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "2023-08-01" to "Tuesday, August 01, 2023"', () => {
    expect(pipe.transform('2023-08-01')).toEqual('Tuesday, August 01, 2023');
  });

  it('should transform "2023-08-01" to "Tuesday, August 01"', () => {
    expect(pipe.transform('2023-08-01', 'full_without_year')).toEqual('Tuesday, August 01');
  });

  it('should transform "2023-08-01" to "01 August, 2023"', () => {
    expect(pipe.transform('2023-08-01', 'day_month_year')).toEqual('01 August, 2023');
  });

  it('should transform "2023-08-01" to "01 Aug, 2023"', () => {
    expect(pipe.transform('2023-08-01', 'day_half-month_year')).toEqual('01 Aug, 2023');
  });
});
