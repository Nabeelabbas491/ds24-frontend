import { FormArray, ValidatorFn, AbstractControl } from '@angular/forms';

export class CustomValidators {
  static validateTimeRange(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const timeRangeArray = control as FormArray;
      const timeRanges: [number, number][] = timeRangeArray.controls.map((control: any) => {
        const { from, to } = control.value;
        return [this.convertToNumber(from), this.convertToNumber(to)];
      });

      for (let index = 0; index < timeRanges.length; index++) {
        const [currentStartTime, currentEndTime] = timeRanges[index];
        if (currentStartTime > currentEndTime) {
          timeRangeArray.controls[index].setValidators([this.isStartMore()]);
        } else {
          const overlaps = timeRanges.some(([startTime, endTime], listIndex) => {
            return listIndex !== index && this.isTimeOverlapping(currentStartTime, currentEndTime, startTime, endTime);
          });

          if (overlaps) {
            timeRangeArray.controls[index].setErrors({ overlap: true });
          } else {
            timeRangeArray.controls[index].setErrors(null);
          }
        }
      }

      if (timeRangeArray.controls.some(control => control.invalid)) {
        return { hasErrors: true };
      }

      return null;
    };
  }

  static isStartMore(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fromControl = control.get('from');
      const toControl = control.get('to');

      if (!fromControl || !toControl) {
        return null;
      }

      const start = this.convertToNumber(fromControl.value);
      const end = this.convertToNumber(toControl.value);

      if (start >= end) {
        return { isStartMore: true };
      }

      return null;
    };
  }

  public static convertToNumber(timeString: any): number {
    return Number(timeString.replace(':', ''));
  }

  public static isTimeOverlapping(
    enteredStartTime: number,
    enteredEndTime: number,
    startTime: number,
    endTime: number,
  ): boolean {
    return (
      (enteredStartTime > startTime && enteredStartTime < endTime) ||
      (startTime > enteredStartTime && startTime < enteredEndTime) ||
      (enteredStartTime === startTime && enteredEndTime === endTime)
    );
  }
}
