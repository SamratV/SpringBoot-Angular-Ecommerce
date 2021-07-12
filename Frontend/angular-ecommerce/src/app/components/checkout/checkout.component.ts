import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { FormService } from 'src/app/services/form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

    checkoutFormGroup: FormGroup;

    totalPrice: number = 0;
    totalQuantity: number = 0;

    creditCardYears: number[] = [];
    creditCardMonths: number[] = [];

    countries: Country[] = [];
    billingAddressStates: State[] = [];
    shippingAddressStates: State[] = [];

    constructor(private formBuilder: FormBuilder, private formService: FormService, private cartService: CartService) { }

    ngOnInit(): void {
        this.reviewCartDetails();

        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                /*
                    Validation logic:

                    firstName: new FormControl(initial-value, [array of validators])
                */
                firstName: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                lastName: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                email: new FormControl('', [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
                    CustomValidators.notOnlyWhitespace
                ])
            }),
            shippingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                city: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ])
            }),
            billingAddress: this.formBuilder.group({
                street: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                city: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                state: new FormControl('', [Validators.required]),
                country: new FormControl('', [Validators.required]),
                zipCode: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ])
            }),
            creditCard: this.formBuilder.group({
                cardType: new FormControl('', [Validators.required]),
                nameOnCard: new FormControl('', [
                    Validators.required,
                    Validators.minLength(2),
                    CustomValidators.notOnlyWhitespace
                ]),
                cardNumber: new FormControl('', [
                    Validators.required,
                    Validators.pattern('^[0-9]{16}$')
                ]),
                securityCode: new FormControl('', [
                    Validators.required,
                    Validators.pattern('^[0-9]{3}$')
                ]),
                expirationMonth: new FormControl('', [Validators.required]),
                expirationYear: new FormControl('', [Validators.required])
            })
        });

        // Populate credit card months.
        const startMonth: number = new Date().getMonth() + 1;
        this.formService.getCreditCardMonths(startMonth).subscribe(
            data => this.creditCardMonths = data
        );

        // Populate credit card years.
        this.formService.getCreditCardYears().subscribe(
            data => this.creditCardYears = data
        );

        // Populate the countries.
        this.formService.getCountries().subscribe(
            data => this.countries = data
        );
    }

    onSubmit() {
        console.log(`Handling the form submit event.`);

        if(this.checkoutFormGroup.invalid) {
            this.checkoutFormGroup.markAllAsTouched();
        }

        console.log(this.checkoutFormGroup.get('customer').value);
        console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);

        console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
        console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
    }

    reviewCartDetails() {
        this.cartService.totalQuantity.subscribe(
            totalQuantity => this.totalQuantity = totalQuantity
        );

        this.cartService.totalPrice.subscribe(
            totalPrice => this.totalPrice = totalPrice
        );
    }

    // Getter: customer
    get firstName() {
        return this.checkoutFormGroup.get('customer.firstName');
    }
    get lastName() {
        return this.checkoutFormGroup.get('customer.lastName');
    }
    get email() {
        return this.checkoutFormGroup.get('customer.email');
    }


    // Getter: shippingAddress
    get shippingAddressStreet() {
        return this.checkoutFormGroup.get('shippingAddress.street');
    }
    get shippingAddressCity() {
        return this.checkoutFormGroup.get('shippingAddress.city');
    }
    get shippingAddressState() {
        return this.checkoutFormGroup.get('shippingAddress.state');
    }
    get shippingAddressZipCode() {
        return this.checkoutFormGroup.get('shippingAddress.zipCode');
    }
    get shippingAddressCountry() {
        return this.checkoutFormGroup.get('shippingAddress.country');
    }


    // Getter: billingAddress
    get billingAddressStreet() {
        return this.checkoutFormGroup.get('billingAddress.street');
    }
    get billingAddressCity() {
        return this.checkoutFormGroup.get('billingAddress.city');
    }
    get billingAddressState() {
        return this.checkoutFormGroup.get('billingAddress.state');
    }
    get billingAddressZipCode() {
        return this.checkoutFormGroup.get('billingAddress.zipCode');
    }
    get billingAddressCountry() {
        return this.checkoutFormGroup.get('billingAddress.country');
    }


    // Getter: creditCard
    get creditCardType() {
        return this.checkoutFormGroup.get('creditCard.cardType');
    }
    get creditCardNameOnCard() {
        return this.checkoutFormGroup.get('creditCard.nameOnCard');
    }
    get creditCardNumber() {
        return this.checkoutFormGroup.get('creditCard.cardNumber');
    }
    get creditCardSecurityCode() {
        return this.checkoutFormGroup.get('creditCard.securityCode');
    }
    get creditCardExpirationMonth() {
        return this.checkoutFormGroup.get('creditCard.expirationMonth');
    }
    get creditCardExpirationYear() {
        return this.checkoutFormGroup.get('creditCard.expirationYear');
    }


    copyShippingAddressToBillingAddress(event: any) {
        // console.log("Inside copyShippingAddressToBillingAddress().");

        if (event.target.checked) {
            this.checkoutFormGroup.controls.billingAddress.setValue(
                this.checkoutFormGroup.controls.shippingAddress.value
            );

            // Bug fix: Copy the states as well.
            this.billingAddressStates = this.shippingAddressStates;
        } else {
            this.checkoutFormGroup.controls.billingAddress.reset();

            // Bug fix: Remove the states.
            this.billingAddressStates = [];
        }
    }

    handleMonthsAndYears(value: number) {
        const flag: boolean = (new Date().getFullYear() == value);
        const startMonth: number = (flag ? new Date().getMonth() + 1 : 1);

        this.formService.getCreditCardMonths(startMonth).subscribe(
            data => this.creditCardMonths = data
        );
    }

    getStates(formGroupName: string) {
        const formGroup = this.checkoutFormGroup.get(formGroupName);

        const countryCode = formGroup.value.country.code;
        // const countryName = formGroup.value.country.name;

        // console.log(`${formGroupName} country code: ${countryCode}`);
        // console.log(`${formGroupName} country name: ${countryName}`);

        this.formService.getStates(countryCode).subscribe(
            data => {
                if (formGroupName === 'shippingAddress') {
                    this.shippingAddressStates = data;
                } else {
                    this.billingAddressStates = data;
                }

                // Select first item by default.
                formGroup.get('state').setValue(data[0]);
            }
        );
    }
}
