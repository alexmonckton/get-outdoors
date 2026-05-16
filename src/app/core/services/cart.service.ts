import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, Product, ProductVariant } from '../models/product.model';
import { NotifyService } from './notify.service';

/**
 * CartService
 *
 * Manages cart state using Angular Signals for fine-grained reactivity.
 * State is currently kept in memory.
 */
@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private readonly notifyService: NotifyService) { }

  private readonly _items = signal<CartItem[]>([]);

  // Derived state
  readonly items = this._items.asReadonly();

  readonly itemCount = computed(() =>
    this._items().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly cart = computed<Cart>(() => {
    const items = this._items();
    const subtotal = items.reduce((sum, item) => {
      const variantDelta =
        item.variantId
          ? (item.product.variants.find((v) => v.id === item.variantId)?.priceDelta ?? 0)
          : 0;
      return sum + (item.product.price + variantDelta) * item.quantity;
    }, 0);

    return {
      items,
      subtotal: Math.round(subtotal * 100) / 100,
      currency: items[0]?.product.currency ?? 'GBP',
    };
  });

  addItem(product: Product, variantId: string | null = null, quantity = 1): boolean {
    let success = false;
    this._items.update((items) => {
      const existing = items.find(
        (i) => i.product.id === product.id && i.variantId === variantId
      );
      if (existing) {
        let variant = existing.product.variants.find((v) => v.id === existing.variantId);
        if (existing.quantity + quantity > (variant ?? product).stock) {
          this.notifyService.showAlert('Cannot add ' + this.readableName(existing.product, quantity, existing.variantId) + ' to the cart. Stock limit reached!', 'error');
          return items;
        }
        //this.notifyService.showAlert('Successfully added ' + this.readableName(existing.product, quantity, existing.variantId) + ' to the cart', 'success');
        success = true;
        return items.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      //this.notifyService.showAlert('Successfully added ' + this.readableName(product, quantity, variantId) + ' to the cart', 'success');
      success = true;
      return [...items, { product, variantId, quantity }];
    });
    return success;
  }

  removeItem(productId: string, variantId: string | null): void {
    this._items.update((items) =>
      items.filter(
        (i) => !(i.product.id === productId && i.variantId === variantId)
      )
    );
  }

  updateQuantity(productId: string, variantId: string | null, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId, variantId);
      return;
    }
    this._items.update((items) =>
      items.map((i) =>
        i.product.id === productId && i.variantId === variantId
          ? { ...i, quantity }
          : i
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }

  readableName(product: Product, quantity: number, variantId: string | null): string {
    const variant = variantId ? product.variants.find((v) => v.id === variantId) : null;
    const quantityText = quantity !== 1 ? `(${quantity})` : '';
    return variant ? `${product.name} (${variant.value}) ${quantityText}` : `${product.name} ${quantityText}`;
  }

  formatPrice(price: number, currency = 'GBP', minimumFractionDigits = 0): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits,
    }).format(price);
  }
}
