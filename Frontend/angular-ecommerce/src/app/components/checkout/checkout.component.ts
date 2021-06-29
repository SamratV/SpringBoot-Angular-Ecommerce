import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { FormService } from 'src/app/services/form.service';

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

    constructor(private formBuilder: FormBuilder, private formService: FormService) { }

    ngOnInit(): void {
        this.checkoutFormGroup = this.formBuilder.group({
            customer: this.formBuilder.group({
                firstName: [''],
                lastName: [''],
                email: ['']
            }),
            shippingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: ['']
            }),
            billingAddress: this.formBuilder.group({
                street: [''],
                city: [''],
                state: [''],
                country: [''],
                zipCode: ['']
            }),
            creditCard: this.formBuilder.group({
                cardType: [''],
                nameOnCard: [''],
                cardNumber: [''],
                securityCode: [''],
                expirationMonth: [''],
                expirationYear: ['']
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
        console.log(this.checkoutFormGroup.get('customer').value);

        console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);

        console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
        console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
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
