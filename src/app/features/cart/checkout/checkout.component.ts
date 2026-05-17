import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, Input, Output, QueryList, signal, ViewChildren } from "@angular/core";
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from "@core/services/cart.service";
import { CheckoutSummaryComponent } from "../checkout-summary/checkout-summary.component";
import { InputFieldComponent } from "@core/components/input-field/input-field.component";
import { ShippingMethodComponent } from "./shipping-method/shipping-method";
import { DialogService } from "@core/services/dialog.service";
import { CheckoutService } from "@core/services/checkout.service";
import { NotifyService } from "@core/services/notify.service";

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
        readonly checkoutService: CheckoutService,
        private router: Router,
        private formBuilder: FormBuilder,
        private el: ElementRef,
        readonly dialogService: DialogService,
        readonly notifyService: NotifyService
    ) { }

    @ViewChildren('formField')
    fields!: QueryList<ElementRef>;

    @Output() close = new EventEmitter<void>();

    shippingCosts: Record<ShippingMethod, number> = { standard: 5, fast: 10, express: 15 };

    loading: boolean = false;

    checkoutForm = this.formBuilder.group({
        customer: this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.pattern(/^\+?[\s\d]{7,15}$/)]
        }),

        shippingAddress: this.formBuilder.group({
            address1: ['', Validators.required],
            address2: [''],
            city: ['', Validators.required],
            postcode: ['', Validators.required]
        }),

        shippingMethod: ['standard', Validators.required],

        termsAndConditions: [false, Validators.requiredTrue]
    });

    closeClick(): void {
        this.close.emit();
    }

    async confirmClick() {
        if (!this.checkoutForm.valid) {
            this.checkoutForm.markAllAsTouched();
            this.focusFirstInvalidControl();
            return;
        }

        const orderData = {
            customer: this.checkoutForm.get('customer')?.value,
            shippingAddress: this.checkoutForm.get('shippingAddress')?.value,
            shippingMethod: this.checkoutForm.get('shippingMethod')?.value,
            termsAndConditions: this.checkoutForm.get('termsAndConditions')?.value,
            items: this.cartService.items().map((item) => ({
                productId: item.product.id,
                variantId: item.variantId,
                quantity: item.quantity,
            })),
        };

        try {
            this.loading = true;
            await this.checkoutService.processOrder(orderData);
            this.loading = false;
            this.cartService.clearCart();
            this.router.navigate(['/products']);
            this.notifyService.showAlert('Order has been confirmed!', 'success');
        } catch (error) {
            this.loading = false;
            console.error('Order processing failed', error);
            this.notifyService.showAlert('Failed to process checkout. Please try again.', 'error');
        }
    }

    openTermsAndConditions(event: Event): void {
        event.preventDefault();
        event.stopPropagation();
        this.dialogService.open({
            title: 'Terms and Conditions',
            content:
                `By purchasing from our store, you agree to our terms and conditions.

Get Outdoors accepts no liability for any issues around the receiving of your order, including but not limited to delays, lost packages, or unreceived items. If you have any concerns about your order, please don't contact our customer service team, in fact we don't have one.

Get Outdoors has no affiliation with Go Outdoors Ltd, JD Sports, or any other retailer. By using our service, you waive your right to sue us for trademark infringement.`
        });
    }

    private focusFirstInvalidControl() {
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

    get phoneError(): string | null {
        if (this.checkoutForm.get('customer.phone')?.touched && this.checkoutForm.get('customer.phone')?.invalid) {
            return 'Please enter a valid phone number';
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