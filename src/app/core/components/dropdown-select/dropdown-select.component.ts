import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-dropdown-select',
    templateUrl: './dropdown-select.component.html',
    styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent {
    @Input() label: string = '';
    @Input() dropdownId: string = 'dropdown-select';
    @Input() selectOptions: { label: string; value: any }[] = [];
    @Input() selectIndex: number = 0;

    @Output() selectIndexChange: EventEmitter<number> = new EventEmitter<number>();

    setSelectOption(index: number) {
        this.selectIndexChange.emit(index);
    }
}