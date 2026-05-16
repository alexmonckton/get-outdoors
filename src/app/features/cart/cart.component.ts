import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/product.model';
import { ButtonSolidComponent } from "@core/components/button-solid/button-solid.component";
import { NumberStepperComponent } from "@core/components/number-stepper/number-stepper.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonSolidComponent, NumberStepperComponent],
  templateUrl: 'cart.component.html',
  styleUrl: 'cart.component.scss',
})
export class CartComponent {
  readonly cartService = inject(CartService);

  remove(item: CartItem): void {
    this.cartService.removeItem(item.product.id, item.variantId);
  }

  updateQty(item: CartItem, newVal: number): void {
    this.cartService.updateQuantity(
      item.product.id,
      item.variantId,
      newVal
    );
  }

  lineTotal(item: CartItem): number {
    const delta = item.variantId
      ? (item.product.variants.find((v) => v.id === item.variantId)?.priceDelta ?? 0)
      : 0;
    return (item.product.price + delta) * item.quantity;
  }

  variantLabel(item: CartItem): string {
    const v = item.product.variants.find((v) => v.id === item.variantId);
    return v ? `${v.label}: ${v.value}` : '';
  }

  variantStock(item: CartItem): number {
    const v = item.product.variants.find((v) => v.id === item.variantId);
    return v ? v.stock : item.product.stock;
  }

  primaryImage(item: CartItem): string {
    return (
      item.product.images.find((i) => i.isPrimary)?.url ??
      item.product.images[0]?.url ??
      'https://placehold.co/160x160/e8e8e8/aaa?text=Item'
    );
  }

  formatPrice(price: number, currency = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  }

  checkout(): void {

  }
}
