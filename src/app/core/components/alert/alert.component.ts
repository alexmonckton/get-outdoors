import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-alert',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'alert.component.html',
    styleUrl: 'alert.component.scss',
})
export class AlertComponent {
    readonly notifyService = inject(NotifyService);

    getAlertClass(type: string): string {
        return `alert alert-${type}`;
    }
}
