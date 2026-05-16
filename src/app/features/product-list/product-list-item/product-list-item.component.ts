import {
    Component,
    OnInit,
    OnDestroy,
    inject,
    signal,
    computed,
    Input,
    Output,
    EventEmitter,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Product } from '@core/models/product.model';

@Component({
    selector: 'app-product-list-item',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './product-list-item.component.html',
    styleUrls: ['./product-list-item.component.scss'],
})
export class ProductListItemComponent {
    @Input() i: number = 0;
    @Input() product!: Product;

    primaryImage(product: Product): string {
        return (
            product.images.find((i) => i.isPrimary)?.url ??
            product.images[0]?.url ??
            'https://placehold.co/600x600/e8e8e8/aaa?text=No+Image'
        );
    }

    discount(price: number, compareAt: number): number {
        return Math.round(((compareAt - price) / compareAt) * 100);
    }

    formatPrice(price: number, currency = 'GBP'): string {
        return new Intl.NumberFormat('en-GB', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(price);
    }

    get cardClass(): string {
        return this.product.isNew ? 'card card--new' : 'card';
    }
}