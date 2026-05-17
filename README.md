# GET OUTDOORS — Product Browsing Frontend

An Angular 19 product browsing storefront, featuring a fully functional mock API backend via HTTP interceptors.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 19 |
| Language | TypeScript 5.6 |
| Styles | SCSS |
| Mock API | `HttpInterceptor` — drop-in replacement for a real backend |

---

## Setup Guide

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4200)
npm start
```
---

## AI Tool Usage

I used AI tools to build an initial skeleton framework of a product browser with mock API interceptor, as well as to generate initial product data. Everything in the app has either been written by me or modified / refactored / restyled by me from the initial AI generated code.

---

## Mock API

All HTTP requests to `environment.apiBaseUrl` (`/api` in dev) are intercepted by `MockApiInterceptor` and resolved locally with simulated latency.