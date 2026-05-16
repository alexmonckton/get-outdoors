import { Component, OnInit, inject, signal, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product, ProductVariant } from '../../core/models/product.model';
import { ButtonSolidComponent } from "@core/components/button-solid/button-solid.component";
import { NumberStepperComponent } from "@core/components/number-stepper/number-stepper.component";

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonSolidComponent, NumberStepperComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit {
  @Input() slug!: string; // bound via withComponentInputBinding()

  private readonly productService = inject(ProductService);
  readonly cartService = inject(CartService);

  product = signal<Product | null>(null);
  isLoading = signal(true);
  error = signal<string | null>(null);
  selectedImageIndex = signal(0);
  selectedVariantId = signal<string | null>(null);
  quantity = signal(1);
  added = signal(false);

  ngOnInit(): void {
    this.productService.getProductBySlug(this.slug).subscribe({
      next: (p) => {
        this.product.set(p);
        // Pre-select first in-stock variant
        const firstInStock = p.variants.find((v) => v.stock > 0);
        if (firstInStock) this.selectedVariantId.set(firstInStock.id);
        this.isLoading.set(false);
      },
      error: () => {
        this.error.set('Product not found.');
        this.isLoading.set(false);
      },
    });
  }

  selectVariant(variant: ProductVariant): void {
    if (variant.stock === 0) return;
    if (this.quantity() > variant.stock) {
      this.quantity.set(variant.stock);
    }
    this.selectedVariantId.set(variant.id);
  }

  selectImage(index: number): void {
    this.selectedImageIndex.set(index);
  }

  addToCart(): void {
    const p = this.product();
    if (!p) return;
    const success = this.cartService.addItem(p, this.selectedVariantId(), this.quantity());
    if (success) {
      this.added.set(true);
      setTimeout(() => this.added.set(false), 2000);
    }
  }

  get addToCartButtonText(): string {
    if (this.added()) {
      return '✓ Added to cart';
    } else if (this.selectedVariant()!.stock === 0) {
      return 'Out of stock';
    } else {
      return 'Add to cart';
    }
  }

  get activeImage(): string {
    const p = this.product();
    if (!p || p.images.length === 0)
      return 'https://placehold.co/800x800/e8e8e8/aaa?text=No+Image';
    return p.images[this.selectedImageIndex()]?.url ?? p.images[0].url;
  }

  selectedVariant(): ProductVariant | null {
    const p = this.product();
    const id = this.selectedVariantId();
    if (!p || !id) return null;
    return p.variants.find((v) => v.id === id) ?? null;
  }

  effectivePrice(): number {
    const p = this.product();
    if (!p) return 0;
    return p.price + (this.selectedVariant()?.priceDelta ?? 0);
  }

  formatPrice(price: number, currency = 'GBP'): string {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  }

  stars(rating: number): string {
    return '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));
  }
}
