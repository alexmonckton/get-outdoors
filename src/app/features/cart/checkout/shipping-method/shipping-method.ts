import { CurrencyPipe, TitleCasePipe, NgClass } from "@angular/common";
import { Component, forwardRef, Input } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CartService } from "@core/services/cart.service";


@Component({
    selector: "app-shipping-method",
    templateUrl: "./shipping-method.html",
    styleUrls: ["./shipping-method.scss"],
    imports: [TitleCasePipe, NgClass],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ShippingMethodComponent),
            multi: true
        }
    ]
})
export class ShippingMethodComponent implements ControlValueAccessor {

    constructor(readonly cartService: CartService
    ) { }

    @Input() label: string = 'standard';
    @Input() animSpeed: number = 1;
    @Input() shippingCost: number = 0;
    @Input() deliveryTime: string = '3-5 business days';

    value: string = '';
    disabled = false;

    private onChange = (_: string) => { };
    private onTouched = () => { };

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInputChange(): void {
        this.onChange(this.label);
        this.onTouched();
    }

    isChecked(): boolean {
        return this.value === this.label;
    }

    get animationClass(): string {
        const speed = Math.round(this.animSpeed);
        return `anim-speed-${Math.min(3, Math.max(1, speed))}`;
    }

}