import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

    // whitespace validation
    static notOnlyWhitespace(control: FormControl) : ValidationErrors {
        if(control.value != null && control.value.trim().length === 0) {
            return {'notOnlyWhitespace': true};
        } 

        return null;
    }
}
