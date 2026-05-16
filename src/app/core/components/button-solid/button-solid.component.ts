import { Component, EventEmitter, Input, Output } from "@angular/core";


@Component({
    selector: 'app-button-solid',
    standalone: true,
    templateUrl: './button-solid.component.html',
    styleUrl: './button-solid.component.scss',
})
export class ButtonSolidComponent {
    @Input() text: string = 'Click';
    @Input() disabled: boolean = false;
    @Input() success: boolean = false;

    @Output() clicked = new EventEmitter<Event>();

    btnClick(event: Event): void {
        if (!this.disabled) {
            this.clicked.emit(event);
        }
    }
}