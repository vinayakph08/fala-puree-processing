---
description: "Use when creating or editing React component (.tsx) files. Covers exports, use client directive, async states, touch targets, Shadcn usage."
applyTo: "**/*.tsx"
---

# Component Rules

## Exports

- `page.tsx` and `layout.tsx`: default export (Next.js requirement)
- **All other components: named export only** — never default export

## Client Directive

Add `"use client"` at the top for any component that uses:
- `useState`, `useEffect`, `useRef` or any React hook
- Event handlers (`onClick`, `onChange`, etc.)
- Browser APIs
- React Query hooks

## Async Data States — All 3 Required

Every component consuming async data must handle all three states:

```tsx
if (isLoading) return <FeatureSkeleton />;
if (error) return <div>Loading Failed...</div>;
if (!data?.length) return <div>No items found</div>;
return <FeatureList data={data} />;
```

## Touch Targets

All interactive elements must have minimum 44px × 44px:

```tsx
<Button className="min-h-[44px] min-w-[44px]">...</Button>
```

## Shadcn Components

- Extend via `cva` variants — **never** one-off `className` overrides on Shadcn primitives
- Always use the full Shadcn Form stack for forms:
  `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`
- Toast: `import { toast } from "sonner"`

## State Placement

| Data type | Where |
|---|---|
| Server/async data | React Query — never copy into `useState` or Context |
| Local UI only (open/close, tab) | `useState` |
| Shared across siblings | Lift to parent |
| App-wide user profile | `useUser()` from UserProvider |

## Utility Functions — Must Not Live in Component Files

Never define utility or helper functions inside a `.tsx` component file. Extract them to the nearest `utils/index.ts`:

| Utility belongs to | Put it in |
|---|---|
| A shared UI component (e.g. `components/camera`) | `components/camera/utils/index.ts` |
| A main-page feature | `app/(protected)/(main-pages)/[feature]/utils/index.ts` |
| A sub-page feature | `app/(protected)/(sub-pages)/[feature]/[page]/utils/index.ts` |

```typescript
// ❌ Wrong — helper defined inside a component file
export function MyComponent() {
  function formatDate(d: Date) { ... } // should be in utils/
  return <div>{formatDate(new Date())}</div>;
}

// ✅ Correct — import from utils/
import { formatDate } from "../utils";
export function MyComponent() {
  return <div>{formatDate(new Date())}</div>;
}
```

**One-call side-effectful initialisation (e.g. generating a unique ID) must use a `useState` lazy initializer, not `useEffect`.** React Strict Mode runs effects twice in development, which doubles side effects like localStorage counter increments. The `useState` initializer is guaranteed to run exactly once.

## Sub-Component Co-location

Small, purely presentational React components (no hooks, no data fetching, no state beyond basic `useState`) that are **only used within a single parent file** may be defined in the same file as that parent. This is idiomatic React — extracting them is over-engineering.

**Extract a sub-component to its own file when:**
- It is used in **2 or more** parent files, OR
- It grows its own hooks, data fetching, or non-trivial lifecycle logic

```tsx
// ✅ Allowed — private presentational component, only used in this file
function StatusBadge({ status }: { status: string }) {
  return <span className="...">{status}</span>;
}

export function FeatureList() {
  return <StatusBadge status="passed" />;
}

// ❌ Wrong — reused across multiple files but not extracted
// StatusBadge appears in both FeatureList and SomeOtherComponent
// → extract to components/ui/status-badge.tsx
```

**Never extract to a sub-file just to reduce line count.** Co-located private components are not a code smell.

```typescript
// ❌ Wrong — useEffect runs twice in Strict Mode dev
useEffect(() => {
  form.setValue("batch_id", generateBatchId()); // counter increments by 2
}, []);

// ✅ Correct — useState lazy init runs exactly once
const [initialBatchId] = useState(() => generateBatchId());
```

## Named Component Template

```tsx
"use client";

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { IFeatureItem } from "@/types/feature";

interface FeatureCardProps {
  item: IFeatureItem;
  onDelete: (id: string) => Promise<void>;
}

export const FeatureCard: FC<FeatureCardProps> = ({ item, onDelete }) => {

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">{item.name}</h3>
      <Button
        variant="destructive"
        onClick={() => onDelete(item.id)}
        className="min-h-[44px] min-w-[44px]"
      >
       Delete
      </Button>
    </div>
  );
};
```

## Status/Style Config Maps

Never inline status-to-style conditionals. Put them in `src/utils/config/`:

```typescript
// src/utils/config/feature-status-config.ts
export const featureStatusConfig: Record<FeatureStatus, string> = {
  active: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-100 text-gray-800",
};
```
