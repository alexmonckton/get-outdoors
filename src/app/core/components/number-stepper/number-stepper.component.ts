import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-number-stepper',
    templateUrl: './number-stepper.component.html',
    styleUrls: ['./number-stepper.component.scss']
})
export class NumberStepperComponent {

    constructor() { }

    @Input() quantity: number = 1;
    @Output() quantityChange: EventEmitter<number> = new EventEmitter<number>();

    @Input() minQuantity: number = 1;
    @Input() maxQuantity: number = 99;

    adjustQty(amount: number): void {
        const newQty = this.quantity + amount;
        this.quantity = Math.min(Math.max(newQty, this.minQuantity), this.maxQuantity);
        this.quantityChange.emit(this.quantity);
    }
}
