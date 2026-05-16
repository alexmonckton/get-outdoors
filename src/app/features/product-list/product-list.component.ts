import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import {
  Product,
  ProductCategory,
  ProductQueryParams,
  ProductSortField,
} from '../../core/models/product.model';
import { ProductListItemComponent } from './product-list-item/product-list-item.component';
import { DropdownSelectComponent } from "@core/components/dropdown-select/dropdown-select.component";
import { SearchFieldComponent } from "@core/components/search-field/search-field.component";

interface FilterState {
  category: ProductCategory | null;
  search: string;
  sortBy: ProductSortField;
  sortDir: 'asc' | 'desc';
  minPrice: number | undefined;
  maxPrice: number | undefined;
  page: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductListItemComponent, DropdownSelectComponent, SearchFieldComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit, OnDestroy {
  private readonly productService = inject(ProductService);
  private destroy$ = new Subject<void>();
  private searchInput$ = new Subject<string>();

  // ── State ────────────────────────────────────────────────────────────────
  products = signal<Product[]>([]);
  totalProducts = signal(0);
  totalPages = signal(0);
  isLoading = signal(true);
  error = signal<string | null>(null);

  filters = signal<FilterState>({
    category: null,
    search: '',
    sortBy: 'createdAt',
    sortDir: 'desc',
    minPrice: undefined,
    maxPrice: undefined,
    page: 1,
  });

  readonly perPage = 12;

  readonly categories: { value: ProductCategory | null; label: string }[] = [
    { value: null, label: 'All' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'apparel', label: 'Apparel' },
    { value: 'footwear', label: 'Footwear' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'camping', label: 'Camping' },
    { value: 'sports', label: 'Sports' },
  ];

  readonly sortOptions: { value: ProductSortField; dir: 'asc' | 'desc'; label: string }[] = [
    { value: 'createdAt', dir: 'desc', label: 'Newest' },
    { value: 'price', dir: 'asc', label: 'Price: Low → High' },
    { value: 'price', dir: 'desc', label: 'Price: High → Low' },
    { value: 'rating', dir: 'desc', label: 'Top Rated' },
    { value: 'name', dir: 'asc', label: 'Name A-Z' },
  ];

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, i) => i + 1)
  );

  ngOnInit() {
    // Debounce search input
    this.searchInput$
      .pipe(debounceTime(350), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.filters.update((f) => ({ ...f, search, page: 1 }));
        this.loadProducts();
      });

    this.loadProducts();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.error.set(null);

    const f = this.filters();
    const query: ProductQueryParams = {
      page: f.page,
      perPage: this.perPage,
      category: f.category ?? undefined,
      search: f.search,
      sortBy: f.sortBy,
      sortDir: f.sortDir,
      minPrice: f.minPrice,
      maxPrice: f.maxPrice,
    };

    this.productService.getProducts(query).subscribe({
      next: (resp) => {
        this.products.set(resp.data);
        this.totalProducts.set(resp.meta.total);
        this.totalPages.set(resp.meta.totalPages);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load products. Please try again.');
        this.isLoading.set(false);
        console.error(err);
      },
    });
  }

  // Filter Handlers

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  setCategory(category: ProductCategory | null): void {
    this.filters.update((f) => ({ ...f, category, page: 1 }));
    this.loadProducts();
  }

  setSortOption(index: number): void {
    const opt = this.sortOptions[index];
    this.filters.update((f) => ({
      ...f,
      sortBy: opt.value,
      sortDir: opt.dir,
      page: 1,
    }));
    this.loadProducts();
  }

  setPage(page: number): void {
    this.filters.update((f) => ({ ...f, page }));
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  resetFilters(): void {
    this.filters.set({
      category: null,
      search: '',
      sortBy: 'createdAt',
      sortDir: 'desc',
      minPrice: undefined,
      maxPrice: undefined,
      page: 1,
    });
    this.loadProducts();
  }

  // Helpers
  isActiveCategory(cat: ProductCategory | null): boolean {
    return this.filters().category === cat;
  }

  activeSortIndex(): number {
    const f = this.filters();
    return this.sortOptions.findIndex(
      (o) => o.value === f.sortBy && o.dir === f.sortDir
    );
  }

  trackById(_: number, product: Product): string {
    return product.id;
  }
}
