import { Injectable, signal } from '@angular/core';

export interface DialogState {
    id: string;
    title?: string;
    content: string;
}

export type DialogInput = string | { title: string; content: string };

@Injectable({
    providedIn: 'root',
})
export class DialogService {
    private readonly dialogState = signal<DialogState[]>([]);

    readonly state = this.dialogState;

    open(payload: DialogInput): string {
        const id = Date.now().toString();
        const dialog: DialogState = typeof payload === 'string'
            ? { id, content: payload }
            : { id, title: payload.title, content: payload.content };

        this.dialogState.update((current) => [...current, dialog]);
        return id;
    }

    close(id: string): void {
        this.dialogState.update((current) => current.filter((dialog) => dialog.id !== id));
    }

    closeLast(): void {
        const dialogs = this.dialogState();
        if (dialogs.length === 0) {
            return;
        }
        this.close(dialogs[dialogs.length - 1].id);
    }

    closeAll(): void {
        this.dialogState.set([]);
    }
}
