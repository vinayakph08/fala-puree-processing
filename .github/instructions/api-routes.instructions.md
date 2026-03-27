---
description: "Use when creating or editing API route files under src/app/api/. Covers auth-first rule, try/catch, HTTP status codes, response shape, logging."
applyTo: "src/app/api/**"
---

# API Route Rules

## Auth — Always the First Line

```typescript
const { user, error: authError } = await getUserFromServerSide();
if (authError || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

Import: `import { getUserFromServerSide } from "@/lib/auth/get-user"`

## Response Shape

- Success: `NextResponse.json({ data }, { status: 200 })` — always `{ data: T }`, never `{ success, data }`
- Failure: `NextResponse.json({ error: "human-readable message" }, { status: <code> })`
- Never return raw Supabase error objects or internal error details to the client

## Data Shape: UNWRAP → WRAP

The controller returns `DbResult<T>` = `{ data: T | null, error: string | null }`. The API route's job is:
1. **UNWRAP** `DbResult<T>` → check `error`, extract `data`
2. **WRAP** `data` → `{ data: T }` HTTP envelope so query-functions can unwrap it on the client

```typescript
// UNWRAP: DbResult<T> → T
const { data, error } = await featureController.getItems({ farmer_id: user.id });
if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

// WRAP: T → { data: T }
return NextResponse.json({ data }, { status: 200 });
```

See `.github/skills/new-feature/references/data-shapes.md` for the full chain.

## HTTP Status Codes

| Situation | Code |
|---|---|
| Success | 200 |
| Created | 201 |
| Unauthorized (no session) | 401 |
| Forbidden (wrong role/ownership) | 403 |
| Not found | 404 |
| Bad request (missing/invalid params) | 400 |
| Server or DB error | 500 |

## Error Handling

- Wrap every handler in try/catch
- Log errors with route context: `console.error("[GET /api/feature]", error)`
- Never call another API Route from within an API Route — call DB Controller directly

## Controller Usage

Import the singleton exported from the db-controller:

```typescript
import { featureController } from "@/app/(protected)/(main-pages)/[feature]/db-controller";
```

## Query Params

```typescript
const id = request.nextUrl.searchParams.get("id");
if (!id) {
  return NextResponse.json({ error: "ID is required" }, { status: 400 });
}
```

## Full Template

```typescript
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { featureController } from "@/app/(protected)/(main-pages)/[feature]/db-controller";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await featureController.getItems({ farmer_id: user.id });

    if (error) {
      console.error("[GET /api/feature]", error);
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE = async (request: NextRequest) => {
  try {
    const { user, error: authError } = await getUserFromServerSide();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data, error } = await featureController.deleteItem({ id });

    if (error) {
      console.error("[DELETE /api/feature]", error);
      return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/feature] Unexpected:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
```
