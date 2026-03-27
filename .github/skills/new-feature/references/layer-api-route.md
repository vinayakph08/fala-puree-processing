# API Route Layer

## Location

`src/app/api/[feature]/route.ts`

## Rules — Quick Reference

1. Auth check is **always the first statement** — before any DB call
2. Wrap every handler in try/catch
3. Return `{ data }` on success, `{ error }` on failure with correct HTTP status
4. Log errors with context: `console.error("[METHOD /api/feature]", error)`
5. Never call another API Route from here — call the DB controller directly
6. Never expose raw Supabase error messages to the client

## Auth Import

```typescript
import { getUserFromServerSide } from "@/lib/auth/get-user";
```

## Controller Import

```typescript
import { featureController } from "@/app/(protected)/(main-pages)/[feature]/db-controller";
```

## HTTP Status Reference

| Case | Status |
|---|---|
| Success | 200 |
| Unauthorized | 401 |
| Bad params | 400 |
| Not found | 404 |
| Server error | 500 |

## Full Template

See [api-route.template.ts](../assets/api-route.template.ts)
