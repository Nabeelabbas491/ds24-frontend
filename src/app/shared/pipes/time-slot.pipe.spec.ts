import { TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';
import { TimeSlotPipe } from './time-slot.pipe';

describe('TimeSlotPipe', () => {
  let pipe: TimeSlotPipe;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TimeSlotPipe],
      imports: [TranslateModule.forRoot()],
    });
    pipe = TestBed.inject(TimeSlotPipe);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('if slot is null then empty string is returned', () => {
    expect(pipe.transform(null)).toEqual('');
  });

  it('transform slot object into desired output', () => {
    expect(pipe.transform({ startTime: '10:00', endTime: '10:30' })).toEqual('10:00 - 10:30');
  });
});
