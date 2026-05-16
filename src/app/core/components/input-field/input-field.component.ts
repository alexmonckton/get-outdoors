import { Component, EventEmitter, Input, Output, forwardRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NG_VALUE_ACCESSOR } from "@angular/forms";

@Component({
    selector: 'app-input-field',
    templateUrl: './input-field.component.html',
    styleUrls: ['./input-field.component.scss'],
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputFieldComponent),
            multi: true
        }
    ]
})
export class InputFieldComponent {
    @Input() label: string = '';
    @Input() inputId: string = 'input-field';
    @Input() type: 'text' = 'text';
    @Input() error: string | null = null;

    @Input() value: string = '';
    @Input() maxLength: number = 100;

    @Input() uppercase: boolean = false;

    onTouched = () => { };
    onChange = (value: string) => { };

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    updateValue(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        if (this.uppercase) {
            value = value.toUpperCase();
            input.value = value;
        }

        this.value = value;
        this.onChange(this.value);
    }

    markAsTouched() {
        this.onTouched();
    }

    get getClass(): string {
        let out = '';
        if (this.error) {
            out += 'error ';
        }
        return out;
    }
}