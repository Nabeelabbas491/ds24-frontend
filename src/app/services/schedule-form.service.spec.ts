import { FormArray, FormBuilder } from '@angular/forms';
import { ScheduleFormService } from './schedule-form.service';

describe('ScheduleFormService', () => {
  let scheduleFormService: ScheduleFormService;

  beforeEach(() => {
    scheduleFormService = new ScheduleFormService();
  });

  it('should remove a time range', () => {
    const fb = new FormBuilder();

    const dayForm = fb.group({
      unavailable: false,
      selected: true,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    const timeRangeArray = dayForm.get('timeRange') as FormArray;

    scheduleFormService.deleteTimeRange(0, dayForm);

    expect(timeRangeArray.length).toBe(1);
  });

  it('should increment time ranges', () => {
    const fb = new FormBuilder();

    const dayForm = fb.group({
      unavailable: false,
      selected: true,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    const timeRangeArray = dayForm.get('timeRange') as FormArray;

    scheduleFormService.addTimeInput(dayForm);

    expect(timeRangeArray.length).toBe(3);

    const lastTimeRange = timeRangeArray.at(2).value;
    expect(lastTimeRange.from).toBe('12:00');
    expect(lastTimeRange.to).toBe('13:00');
  });

  it('should change day selection', () => {
    const fb = new FormBuilder();

    const dayForm = fb.group({
      unavailable: false,
      selected: false,
      timeRange: fb.array([fb.group({ from: '09:00', to: '10:00' }), fb.group({ from: '10:00', to: '11:00' })]),
    });

    scheduleFormService.toggleDaySelection({ target: { checked: true } }, dayForm);

    expect(dayForm.get('selected')?.value).toBe(true);

    const timeRangeArray = dayForm.get('timeRange') as FormArray;
    expect(timeRangeArray.length).toBe(2);
  });
});
