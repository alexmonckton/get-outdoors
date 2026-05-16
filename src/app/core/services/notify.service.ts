import { Injectable, signal } from '@angular/core';

export interface Alert {
    id: string;
    message: string;
    type: 'error';
}

@Injectable({
    providedIn: 'root',
})
export class NotifyService {
    alerts = signal<Alert[]>([]);

    showAlert(message: string, type: 'error' = 'error', duration = 5000) {
        const id = Date.now().toString();
        const alert: Alert = { id, message, type };

        this.alerts.update((current) => [...current, alert]);

        if (duration > 0) {
            setTimeout(() => {
                this.closeAlert(id);
            }, duration);
        }
    }

    closeAlert(id: string) {
        this.alerts.update((current) => current.filter((alert) => alert.id !== id));
    }
}
