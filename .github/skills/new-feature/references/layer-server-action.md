# Server Action Layer

## Location

`src/app/(protected)/(main-pages)/[feature]/server-actions/index.ts`

## Rules — Quick Reference

1. `"use server"` is the first line of the file
2. Get user via `createClient().auth.getUser()` — not `getUserFromServerSide`
3. Validate with Zod before any DB call — even if client already validated
4. Call DB controller directly — **never** via fetch or API Route
5. Call `revalidatePath()` after every mutation, before the return
6. Return `{ data, error }` — error can be a string or fieldErrors object

## Zod Schema Location

`src/app/(protected)/(main-pages)/[feature]/utils/[feature]-schema.ts`

```typescript
import { z } from "zod";

export const createFeatureSchema = z.object({
  farmer_id: z.string().uuid(),
  name: z.string().min(1, { message: "validation.required" }),
});

export type CreateFeatureFormData = z.infer<typeof createFeatureSchema>;
```

Note: Zod error messages use **translation keys**, not raw English strings.

## Full Template

See [server-action.template.ts](../assets/server-action.template.ts)
