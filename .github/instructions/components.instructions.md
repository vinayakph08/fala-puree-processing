---
description: "Use when creating or editing React component (.tsx) files. Covers exports, use client directive, async states, touch targets, i18n with useTranslations, Shadcn usage."
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
if (error) return <div>{t("errors.loadFailed")}</div>;
if (!data?.length) return <div>{t("page.empty")}</div>;
return <FeatureList data={data} />;
```

## Internationalization

- Import: `import { useTranslations } from "next-intl"`
- Usage: `const t = useTranslations("featureName")`
- **Never hardcode** user-facing strings — always use `t("key")`
- Multiple namespaces: `const tCommon = useTranslations("common")`
- Use **English numerals** even in Kannada context (1, 2, 3 — not ೧, ೨, ೩)
- Currency: `new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount)`

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
| App-wide farmer profile | `useFarmer()` from FarmerProvider |

## Named Component Template

```tsx
"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";
import { Button } from "@/components/ui/button";
import { IFeatureItem } from "@/types/feature";

interface FeatureCardProps {
  item: IFeatureItem;
  onDelete: (id: string) => Promise<void>;
}

export const FeatureCard: FC<FeatureCardProps> = ({ item, onDelete }) => {
  const t = useTranslations("feature");
  const tCommon = useTranslations("common");

  return (
    <div className="rounded-lg border p-4 space-y-2">
      <h3 className="font-semibold">{item.name}</h3>
      <Button
        variant="destructive"
        onClick={() => onDelete(item.id)}
        className="min-h-[44px] min-w-[44px]"
      >
        {tCommon("buttons.delete")}
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
