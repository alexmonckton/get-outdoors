import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MOCK_PRODUCTS } from '../services/mock-data';
import {
  PaginatedResponse,
  Product,
  ProductQueryParams,
} from '../models/product.model';

/**
 * MockApiInterceptor
 *
 * Intercepts every request whose URL starts with environment.apiBaseUrl
 * and returns realistic mock responses with simulated network latency.
 *
 * Supported endpoints:
 *   GET  /api/products              → PaginatedResponse<Product>
 *   GET  /api/products/:id          → Product
 *   GET  /api/products/slug/:slug   → Product
 *   POST /api/checkout              → void
 *
 * Replace or remove this interceptor when wiring up a real backend.
 */
@Injectable()
export class MockApiInterceptor implements HttpInterceptor {
  private readonly base = environment.apiBaseUrl;
  private readonly latency = environment.mockApiDelayMs;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (!req.url.startsWith(this.base)) {
      return next.handle(req);
    }

    const path = req.url.slice(this.base.length); // e.g. "/products" or "/products/prod_001"

    return of(null).pipe(
      delay(this.latency),
      switchMap(() => {
        try {
          const response = this.route(req.method, path, req);
          return of(new HttpResponse({ status: 200, body: response }));
        } catch (err: unknown) {
          const e = err as { status?: number; message?: string };
          return throwError(() =>
            new HttpResponse({
              status: e.status ?? 500,
              body: { code: 'INTERNAL_ERROR', message: e.message ?? 'Unknown error' },
            })
          );
        }
      })
    );
  }

  // Router

  private route(method: string, path: string, req: HttpRequest<unknown>): unknown {
    if (method === 'GET') {
      // GET /products
      if (path === '/products' || path === '/products/') {
        return this.handleListProducts(req);
      }
      // GET /products/slug/:slug
      const slugMatch = path.match(/^\/products\/slug\/([^/]+)$/);
      if (slugMatch) {
        return this.handleGetProductBySlug(slugMatch[1]);
      }
      // GET /products/:id
      const idMatch = path.match(/^\/products\/([^/]+)$/);
      if (idMatch) {
        return this.handleGetProductById(idMatch[1]);
      }
    }
    if (method === 'POST' && path === '/checkout') {
      return this.handleProcessOrder(req);
    }

    this.throw404(`No mock route for ${method} ${path}`);
  }

  // Handlers

  private handleListProducts(req: HttpRequest<unknown>): PaginatedResponse<Product> {
    const p = req.params;
    const query: ProductQueryParams = {
      page: parseInt(p.get('page') ?? '1', 10),
      perPage: parseInt(p.get('perPage') ?? '12', 10),
      category: (p.get('category') as ProductQueryParams['category']) || null,
      search: p.get('search') ?? '',
      sortBy: (p.get('sortBy') as ProductQueryParams['sortBy']) ?? 'createdAt',
      sortDir: (p.get('sortDir') as 'asc' | 'desc') ?? 'desc',
      minPrice: p.get('minPrice') ? parseFloat(p.get('minPrice')!) : undefined,
      maxPrice: p.get('maxPrice') ? parseFloat(p.get('maxPrice')!) : undefined,
    };

    let results = [...MOCK_PRODUCTS];

    // Filter: category
    if (query.category) {
      results = results.filter((p) => p.category === query.category);
    }

    // Filter: search
    if (query.search) {
      const q = query.search.toLowerCase();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    // Filter: price range
    if (query.minPrice !== undefined) {
      results = results.filter((p) => p.price >= query.minPrice!);
    }
    if (query.maxPrice !== undefined) {
      results = results.filter((p) => p.price <= query.maxPrice!);
    }

    // Sort
    results.sort((a, b) => {
      let cmp = 0;
      switch (query.sortBy) {
        case 'price':
          cmp = a.price - b.price;
          break;
        case 'rating':
          cmp = a.rating - b.rating;
          //If ratings are equal, sort by review count to yield most highly reviewed products first
          if (cmp === 0) {
            cmp = a.reviewCount - b.reviewCount;
          }
          break;
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'createdAt':
        default:
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return query.sortDir === 'asc' ? cmp : -cmp;
    });

    // Paginate
    const total = results.length;
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 12;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const data = results.slice(start, start + perPage);

    return {
      data,
      meta: { total, page, perPage, totalPages },
    };
  }

  private handleGetProductById(id: string): Product {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) this.throw404(`Product '${id}' not found`);
    return product!;
  }

  private handleGetProductBySlug(slug: string): Product {
    const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!product) this.throw404(`Product slug '${slug}' not found`);
    return product!;
  }

  private handleProcessOrder(req: HttpRequest<unknown>): void {
    // In a real implementation, we'd validate the request body and process the order.
    // Here we'll simulate success if the body has the expected shape

    const body = req.body as {
      customer: { name: string; email: string; phone?: string };
      shippingAddress: { address1: string; address2?: string; city: string; postcode: string };
      shippingMethod: string;
      termsAndConditions: boolean;
      items: Array<{
        productId: string | null;
        variantId: string | null;
        quantity: number;
      }>;
    };

    const itemsValid = Array.isArray(body?.items) && body.items.length > 0 && body.items.every((item) =>
      item &&
      (typeof item.productId === 'string') &&
      (item.variantId === null || typeof item.variantId === 'string') &&
      typeof item.quantity === 'number' && item.quantity > 0
    );

    if (
      !body ||
      !body.customer ||
      typeof body.customer.name !== 'string' ||
      typeof body.customer.email !== 'string' ||
      !body.shippingAddress ||
      typeof body.shippingAddress.address1 !== 'string' ||
      typeof body.shippingAddress.city !== 'string' ||
      typeof body.shippingAddress.postcode !== 'string' ||
      typeof body.shippingMethod !== 'string' ||
      body.termsAndConditions !== true ||
      !itemsValid
    ) {
      throw { status: 400, message: 'Invalid order data' };
    }

    // Simulate a random failure 10% of the time
    if (Math.random() < 0.1) {
      throw { status: 500, message: 'Failed to process order. Please try again.' };
    }

    // Otherwise, succeed with no response body
  }

  // Helpers

  private throw404(message: string): never {
    throw { status: 404, message };
  }
}
