import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { CustomValidators } from './custom-validator';
describe('CustomValidators', () => {
  describe('isStartMore Validator', () => {
    it('should return an error object if start time is more than or equal to end time', () => {
      const group = new FormGroup({
        from: new FormControl('23:00'),
        to: new FormControl('22:00'),
      });

      const validatorFn = CustomValidators.isStartMore();
      expect(validatorFn(group)).toEqual({ isStartMore: true });
    });

    it('should return null if start time is less than end time', () => {
      const group = new FormGroup({
        from: new FormControl('10:00'),
        to: new FormControl('11:00'),
      });

      const validatorFn = CustomValidators.isStartMore();
      expect(validatorFn(group)).toBeNull();
    });
  });
});

describe('changeOfInputValues Validator', () => {
  function createTimeRangeFormGroup(start: string, end: string): FormGroup {
    return new FormGroup({
      from: new FormControl(start),
      to: new FormControl(end),
    });
  }

  it('should set overlap error on overlapping time ranges', () => {
    const formArray = new FormArray([
      createTimeRangeFormGroup('09:00', '11:00'),
      createTimeRangeFormGroup('10:00', '12:00'),
    ]);

    const validatorFn = CustomValidators.validateTimeRange();
    validatorFn(formArray);

    expect(formArray.at(1).errors).toEqual({ overlap: true });
  });

  it('should not set any errors for non-overlapping time ranges', () => {
    const formArray = new FormArray([
      createTimeRangeFormGroup('09:00', '10:00'),
      createTimeRangeFormGroup('10:00', '11:00'),
    ]);

    const validatorFn = CustomValidators.validateTimeRange();
    validatorFn(formArray);

    expect(formArray.at(0).errors).toBeNull();
    expect(formArray.at(1).errors).toBeNull();
  });

  it('should convert to numbers', () => {
    const timeString = '19:00';

    const result = CustomValidators.convertToNumber(timeString);

    expect(result).toBe(1900);
  });
});
