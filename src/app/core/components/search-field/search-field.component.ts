import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-search-field',
    templateUrl: './search-field.component.html',
    styleUrls: ['./search-field.component.scss'],
    imports: [CommonModule],
})
export class SearchFieldComponent {
    @Input() label: string = '';
    @Input() inputId: string = 'search-field';

    @Input() value: string = '';

    @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
}