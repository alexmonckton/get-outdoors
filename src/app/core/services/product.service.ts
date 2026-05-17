import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PaginatedResponse,
  Product,
  ProductQueryParams,
} from '../models/product.model';

/**
 * ProductService
 *
 * Thin HTTP client that talks to /api/products.
 * All requests are intercepted by MockApiInterceptor in development;
 * The base URL can be swapped in environment.production.ts to hit a real backend.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly httpClient: HttpClient) { }
  private readonly base = `${environment.apiBaseUrl}/products`;

  getProducts(query: ProductQueryParams = {}): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();

    if (query.page) params = params.set('page', String(query.page));
    if (query.perPage) params = params.set('perPage', String(query.perPage));
    if (query.category) params = params.set('category', query.category);
    if (query.search) params = params.set('search', query.search);
    if (query.sortBy) params = params.set('sortBy', query.sortBy);
    if (query.sortDir) params = params.set('sortDir', query.sortDir);
    if (query.minPrice !== undefined) params = params.set('minPrice', String(query.minPrice));
    if (query.maxPrice !== undefined) params = params.set('maxPrice', String(query.maxPrice));
    if (query.tags?.length) params = params.set('tags', query.tags.join(','));

    return this.httpClient.get<PaginatedResponse<Product>>(this.base, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.base}/${id}`);
  }

  getProductBySlug(slug: string): Observable<Product> {
    return this.httpClient.get<Product>(`${this.base}/slug/${slug}`);
  }
}
