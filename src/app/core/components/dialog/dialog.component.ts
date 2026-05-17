import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DialogService } from '../../services/dialog.service';

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'dialog.component.html',
    styleUrl: 'dialog.component.scss',
})
export class DialogComponent {
    readonly dialogService = inject(DialogService);

    close(dialogId: string): void {
        this.dialogService.close(dialogId);
    }

    closeTop(): void {
        this.dialogService.closeLast();
    }
}
