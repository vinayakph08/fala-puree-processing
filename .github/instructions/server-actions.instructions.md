---
description: "Use when creating or editing server-actions files. Covers use server directive, auth, Zod validation, DB controller calls, revalidatePath, return shape."
applyTo: "**/server-actions/**"
---

# Server Action Rules

## File Header

`"use server"` must be the first line of the file.

## Auth Pattern

Get user via Supabase directly (server actions run server-side):

```typescript
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();
if (!user) return { data: null, error: "Unauthorized" };
```

## Validation — Always Server-Side

Even if client already validated, re-validate with Zod on the server before any DB call:

```typescript
const validated = featureSchema.safeParse(payload);
if (!validated.success) {
  return { data: null, error: validated.error.flatten().fieldErrors };
}
```

## DB Call — Direct Controller, Never via fetch or API Route

```typescript
const { data, error } = await featureController.createItem({ data: validated.data });
```

## Cache Revalidation

- Always call `revalidatePath("/[feature]")` after any mutation
- For sub-page mutations: also call `revalidatePath("/[feature]/[id]")`
- Call revalidatePath **before** the return statement

## Return Shape

- Success: `{ data: result, error: null }`
- Failure: `{ data: null, error: "message" | fieldErrors }`

## Full Template

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { featureController } from "../db-controller";
import { createFeatureSchema } from "../utils/feature-schema";

export async function createFeatureAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const rawPayload = {
    farmer_id: user.id,
    field_one: formData.get("field_one") as string,
    field_two: parseFloat(formData.get("field_two") as string),
  };

  const validated = createFeatureSchema.safeParse(rawPayload);
  if (!validated.success) {
    return { data: null, error: validated.error.flatten().fieldErrors };
  }

  const { data, error } = await featureController.createItem({ data: validated.data });

  revalidatePath("/feature");

  return { data, error };
}

export async function updateFeatureAction(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { data: null, error: "Unauthorized" };

  const rawPayload = {
    field_one: formData.get("field_one") as string,
  };

  const { data, error } = await featureController.updateItem({ id, data: rawPayload });

  revalidatePath("/feature");
  revalidatePath(`/feature/${id}`);

  return { data, error };
}
```

## Zod Schema Convention (in `utils/feature-schema.ts`)

```typescript
import { z } from "zod";

export const createFeatureSchema = z.object({
  farmer_id: z.string().uuid(),
  field_one: z.string().min(1, { message: "validation.required" }),
  field_two: z.number().min(0.1, { message: "validation.positiveNumber" }),
});

export type CreateFeatureFormData = z.infer<typeof createFeatureSchema>;
```
