import { AbstractControl } from '@angular/forms';

export function ValidatePhone(control: AbstractControl) {
  if(control.value) {
    return {
      validPhone: control.value.length != 9
    };
  } else {
    return null;
  }
}
