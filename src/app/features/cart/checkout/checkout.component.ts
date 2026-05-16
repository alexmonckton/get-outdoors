import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from "@core/services/cart.service";
import { CheckoutSummaryComponent } from "../checkout-summary/checkout-summary.component";
import { InputFieldComponent } from "@core/components/input-field/input-field.component";
import { ShippingMethodComponent } from "./shipping-method/shipping-method";

type ShippingMethod = 'standard' | 'fast' | 'express';


@Component
    ({
        selector: "app-checkout",
        templateUrl: "./checkout.component.html",
        styleUrls: ["./checkout.component.scss"],
        imports: [CommonModule, CheckoutSummaryComponent, InputFieldComponent, ReactiveFormsModule, ShippingMethodComponent]
    })
export class CheckoutComponent {
    constructor(
        readonly cartService: CartService,
        private formBuilder: FormBuilder,
        private el: ElementRef
    ) { }

    @ViewChildren('formField')
    fields!: QueryList<ElementRef>;

    @Output() close = new EventEmitter<void>();

    shippingCosts: Record<ShippingMethod, number> = { standard: 5, fast: 10, express: 15 };

    checkoutForm = this.formBuilder.group({
        customer: this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
        }),

        shippingAddress: this.formBuilder.group({
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            postcode: ['', Validators.required]
        }),

        shippingMethod: ['standard', Validators.required],

        // payment: this.formBuilder.group({
        //     method: ['card', Validators.required],
        //     cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
        //     expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
        //     cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
        // }),

        termsAndConditions: [false, Validators.requiredTrue]
    });

    closeClick(): void {
        this.close.emit();
    }

    confirmClick(): void {
        // Placeholder for actual checkout logic
        if (this.checkoutForm.valid) {
            alert('Checkout confirmed! (This is a placeholder action.)');
        } else {
            this.checkoutForm.markAllAsTouched();
            this.focusFirstInvalidControl();
        }
    }

    private focusFirstInvalidControl(): void {
        const invalidKey = this.findFirstInvalidControl(this.checkoutForm);
        if (!invalidKey) {
            return;
        }

        const selector = invalidKey == 'termsAndConditions' ? `input[formControlName="${invalidKey}"]` : `app-input-field[formControlName="${invalidKey}"] input.input-field`;
        const invalidElement = this.el.nativeElement.querySelector(selector) as HTMLElement | null;
        invalidElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        invalidElement?.focus();
    }

    private findFirstInvalidControl(group: FormGroup): string | null {
        for (const key of Object.keys(group.controls)) {
            const control = group.controls[key];
            if (control instanceof FormGroup) {
                const childKey = this.findFirstInvalidControl(control);
                if (childKey) {
                    return childKey;
                }
            } else if (control.invalid) {
                return key;
            }
        }
        return null;
    }

    // Error message handling
    get nameError(): string | null {
        if (this.checkoutForm.get('customer.name')?.touched && this.checkoutForm.get('customer.name')?.invalid) {
            return 'Full name is required';
        }
        return null;
    }

    get emailError(): string | null {
        if (this.checkoutForm.get('customer.email')?.touched && this.checkoutForm.get('customer.email')?.invalid) {
            if (this.checkoutForm.get('customer.email')?.errors?.['required']) {
                return 'Email address is required';
            } else if (this.checkoutForm.get('customer.email')?.errors?.['email']) {
                return 'Please enter a valid email address';
            }
        }
        return null;
    }

    get address1Error(): string | null {
        if (this.checkoutForm.get('shippingAddress.address1')?.touched && this.checkoutForm.get('shippingAddress.address1')?.invalid) {
            return 'Address 1 is required';
        }
        return null;
    }

    get cityError(): string | null {
        if (this.checkoutForm.get('shippingAddress.city')?.touched && this.checkoutForm.get('shippingAddress.city')?.invalid) {
            return 'Town/City is required';
        }
        return null;
    }

    get postcodeError(): string | null {
        if (this.checkoutForm.get('shippingAddress.postcode')?.touched && this.checkoutForm.get('shippingAddress.postcode')?.invalid) {
            return 'Postcode is required';
        }
        return null;
    }

    get selectedShippingCost(): number {
        const method = this.checkoutForm.get('shippingMethod')?.value as ShippingMethod | null;
        return method ? this.shippingCosts[method] : 0;
    }

    get termsError(): string | null {
        if (this.checkoutForm.get('termsAndConditions')?.touched && this.checkoutForm.get('termsAndConditions')?.invalid) {
            return 'You must agree to the terms and conditions';
        }
        return null;
    }
}