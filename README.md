# GET OUTDOORS — Product Browsing Frontend

An Angular 19 product browsing storefront, featuring a fully functional mock API backend via HTTP interceptors.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 19 (standalone components, signals) |
| Language | TypeScript 5.6 |
| Styles | SCSS (component-scoped + global tokens) |
| State | Angular Signals |
| Mock API | `HttpInterceptor` — drop-in replacement for a real backend |
| Routing | Lazy-loaded feature routes |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4200)
npm start

# Production build
npm run build
```

---

## Mock API

All HTTP requests to `environment.apiBaseUrl` (`/api` in dev) are intercepted by `MockApiInterceptor` and resolved locally with simulated latency.

### Switching to a Real Backend

1. Update `src/environments/environment.production.ts`:
   ```ts
   export const environment = {
     production: true,
     apiBaseUrl: 'https://api.yourstore.com/v1',
     mockApiDelayMs: 0,
   };
   ```
2. Remove `MockApiInterceptor` from `app.config.ts` providers.

That's it. `ProductService` is already wired to `environment.apiBaseUrl` and makes standard HTTP calls — no other changes needed.

---

## Features

- **Product list** — grid layout, category filter pills, search, sort, skeleton loading, pagination
- **Product detail** — image gallery, variant selector (size, colour, etc.), quantity control, add to cart with feedback
- **Cart** — reactive with Angular Signals; quantity adjustment, line totals, subtotal
- **Design** — green outdoors theme, `Bebas Neue` display font, `DM Sans` body, `DM Mono` for UI labels
- **Architecture** — lazy-loaded routes, standalone components, typed models, path aliases (`@core/*`, `@features/*`, `@assets/*`)

---

## Extending

### Add a new API endpoint

Add a new `case` in `MockApiInterceptor.route()` and a corresponding handler method. Follow the existing pattern.
