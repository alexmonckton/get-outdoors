import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ButtonSolidComponent } from "@core/components/button-solid/button-solid.component";
import { CartService } from "@core/services/cart.service";


@Component
    ({
        selector: "app-checkout-summary",
        templateUrl: "./checkout-summary.component.html",
        styleUrls: ["./checkout-summary.component.scss"],
        imports: [ButtonSolidComponent]
    })
export class CheckoutSummaryComponent {
    constructor(
        readonly cartService: CartService
    ) { }

    @Input() buttonText = "Proceed to checkout";
    @Output() confirm = new EventEmitter<void>();
    @Input() shippingCost: number | null = null;

    buttonClick() {
        this.confirm.emit();
    }
}