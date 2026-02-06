# Routes Directory

This directory contains all routing-related configuration and lazy-loaded component imports for the EasyStore application.

## Files

### `lazyComponents.ts`

Centralized lazy-loaded component imports using React's `lazy()` function. This file exports all page components and layouts used throughout the application.

**Benefits:**

- Single source of truth for all lazy imports
- Easier to maintain and update
- Reduces code duplication
- Improves App.tsx readability

**Usage:**

```tsx
import * as Pages from "@/routes/lazyComponents";

<Route path="/" element={<Pages.HomepageLayout />}>
  <Route index element={<Pages.LandingPage />} />
</Route>;
```

### `index.ts`

Route path constants organized by application section (Website, Auth, Account, Vendor, Admin).

**Benefits:**

- Type-safe route references
- Easy to update routes across the application
- Prevents typos in route paths
- Provides helper functions for dynamic routes

**Usage:**

```tsx
import { WEBSITE_ROUTES, buildRoute } from "@/routes";

navigate(WEBSITE_ROUTES.HOME);
navigate(buildRoute.productDetails("product-slug"));
```

### `temp.ts`

Legacy route constants (deprecated - use `index.ts` instead).

### `authRoutes.ts`

Auth-specific route configuration (may be merged into `index.ts` in the future).

## Best Practices

1. **Always use route constants** instead of hardcoded strings
2. **Use the buildRoute helpers** for dynamic routes with parameters
3. **Keep lazy imports in lazyComponents.ts** - don't create new lazy imports elsewhere
4. **Update both the route constant and App.tsx** when adding new routes

## Example: Adding a New Route

1. Add the lazy import to `lazyComponents.ts`:

```tsx
export const NewPage = lazy(() => import("@/modules/website/pages/NewPage"));
```

2. Add the route constant to `index.ts`:

```tsx
export const WEBSITE_ROUTES = {
  // ... existing routes
  NEW_PAGE: "/new-page",
} as const;
```

3. Add the route to `App.tsx`:

```tsx
<Route path="new-page" element={<Pages.NewPage />} />
```
