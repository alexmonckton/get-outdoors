import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";


@Component({
    selector: 'app-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss'],
    imports: [CommonModule]
})
export class InputFieldComponent {
    @Input() label: string = '';
    @Input() inputId: string = 'input-field';
    @Input() type: 'text' | 'search' = 'text';
    @Input() value: string = '';
    @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
}