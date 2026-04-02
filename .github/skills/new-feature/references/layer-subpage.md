# Sub-Page Layer Reference

## When to Create a Sub-Page

Create a sub-page when the design has a **detail or drill-down screen** that:
- Belongs to a parent main-page feature (e.g. inventory detail → inventory)
- Needs its own URL (e.g. `/inventory/[id]`)
- Should show a back-button header instead of the bottom-nav main layout

## Directory Structure

```
src/app/(protected)/
├── (main-pages)/[feature]/         ← parent feature lives here
│   ├── db-controller/index.ts      ← shared DB controller — sub-page imports from here
│   ├── utils/
│   │   ├── query-keys/index.ts     ← FEATURE_KEYS — sub-page hook MUST import from here
│   │   └── query-functions/index.ts ← api* functions — sub-page hook imports from here
│   └── server-actions/index.ts     ← parent server actions — reuse if possible
│
└── (sub-pages)/[feature]/[id]/     ← sub-page lives here
    ├── layout.tsx                  ← "use client", SubPageLayout, required backHref
    ├── page.tsx                    ← Server Component, HydrationBoundary, parent DB controller
    ├── hooks/
    │   └── use-[feature]-detail.tsx ← imports FEATURE_KEYS + api* from parent utils/
    ├── server-actions/             ← CONDITIONAL: only if sub-page has unique forms
    │   └── index.ts
    └── components/
        └── [detail-client]/
            └── index.tsx
```

## layout.tsx Pattern

Always a **client component** — needed for `useTranslations` and to receive the `backHref` string.

```tsx
"use client";

import { SubPageLayout } from "@/components/layout/subpage-layout";
import { useTranslations } from "next-intl";

export default function FeatureDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("feature");

  return (
    <SubPageLayout
      title={t("details.title")}
      backHref="/feature"           // ← always the parent page's route
      actionButton={<EditButton />} // ← optional
    >
      {children}
    </SubPageLayout>
  );
}
```

**Rules:**
- `backHref` is **required** — always set it to the parent page's route (e.g. `"/inventory"`)
- Never omit `backHref` or use `router.back()` — it breaks on direct URL access and PWA deep links
- `actionButton` is optional — only pass it if the design shows an action in the header (e.g. Edit, Delete)
- `title` comes from `useTranslations` — never hardcode English text

## page.tsx Pattern

Server Component — same `Promise.allSettled` + `HydrationBoundary` pattern as the parent page.
Calls the **parent feature's DB controller** directly — no new controller is created for sub-pages.

```tsx
import { notFound, redirect } from "next/navigation";
import { getUserFromServerSide } from "@/lib/auth/get-user";
import { FeatureDetailClient } from "./components/feature-detail-client";
import { getQueryClient } from "@/lib/query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { featureController } from "@/app/(protected)/(main-pages)/feature/db-controller"; // ← parent's controller
import { FEATURE_KEYS } from "@/app/(protected)/(main-pages)/feature/utils/query-keys"; // ← parent's keys

export default async function FeatureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const queryClient = getQueryClient();
  const { user, error: userError } = await getUserFromServerSide();
  const { id } = await params;

  if (userError || !user) redirect("/");

  try {
    await Promise.allSettled([
      queryClient.prefetchQuery({
        queryKey: FEATURE_KEYS.detail(id),
        queryFn: async () => {
          const { data, error } = await featureController.getById({ id, farmerId: user.id });
          if (error || !data) throw new Error("Not found");
          return data;
        },
      }),
    ]);

    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <FeatureDetailClient id={id} />
      </HydrationBoundary>
    );
  } catch {
    notFound();
  }
}
```

## hooks/ Rules

The sub-page detail hook lives in the sub-page directory but **shares the parent's data plumbing**.

```tsx
// hooks/use-feature-detail.tsx
import { useQuery } from "@tanstack/react-query";
import { FEATURE_KEYS } from "@/app/(protected)/(main-pages)/feature/utils/query-keys"; // ← parent's keys
import { apiGetFeatureById } from "@/app/(protected)/(main-pages)/feature/utils/query-functions"; // ← parent's api*
```

**Rules:**
- Always import `FEATURE_KEYS` from the **parent's** `utils/query-keys/index.ts` — never define new keys
- Always import `api*` functions from the **parent's** `utils/query-functions/index.ts` — never duplicate them
- Cache invalidation in the parent (e.g. after an edit) will automatically update the sub-page's cached data

## server-actions/ — Conditional

Only create `server-actions/index.ts` inside the sub-page if it has forms **not already covered** by the parent's server actions.

- If the sub-page shows an edit form for the same entity the parent manages → reuse the parent's server actions
- If the sub-page manages a genuinely different entity (e.g. images on an inventory detail page) → create sub-page server actions

## No Bottom Nav — Intentional

Sub-pages use `SubPageLayout` which has no `MobileBottomNav`. This is intentional:
- The back button is the primary navigation out of a sub-page
- Adding bottom nav creates conflicting navigation affordances
- Sub-pages are focused detail views — one task at a time

## Standalone Sub-Page Build (Existing Feature)

When a developer only needs to add a sub-page to an **already-built feature** (types, DB controller, API route, and hook already exist), use this condensed flow instead of the full new-feature steps.

**How to invoke:**
> "add a sub-page for [feature]" / "create a detail page for [feature]" / "add drill-down to [feature]"

### Steps — Standalone Sub-Page Only

**Step 1 — Check parent query-keys**
Open `(main-pages)/[feature]/utils/query-keys/index.ts`. Confirm `FEATURE_KEYS.detail(id)` exists. If missing, add it.

**Step 2 — Check parent query-functions**
Open `(main-pages)/[feature]/utils/query-functions/index.ts`. Confirm an `apiGet[Feature]ById` function exists. If missing, add it (calls `/api/[feature]/[id]` or equivalent).

**Step 3 — Check parent API route**
Confirm `src/app/api/[feature]/[id]/route.ts` (or equivalent GET-by-id endpoint) exists. If missing, create it following the [api-route reference](./layer-api-route.md).

**Step 4 — Create sub-page files**
```
(sub-pages)/[feature]/[id]/
├── layout.tsx
├── page.tsx
├── hooks/use-[feature]-detail.tsx
├── server-actions/index.ts     ← only if sub-page has unique forms
└── components/[detail-client]/index.tsx
```
Follow the `layout.tsx`, `page.tsx`, and `hooks/` patterns in this reference.

**Step 5 — Translations**
Add new keys to the **existing** `public/locales/en/[feature].json` and `public/locales/kn/[feature].json` — never create new translation files for a sub-page.

### Checklist — Standalone Sub-Page
- [ ] `FEATURE_KEYS.detail(id)` exists in parent's `utils/query-keys/`
- [ ] `apiGet[Feature]ById` exists in parent's `utils/query-functions/`
- [ ] `layout.tsx` has `backHref` set to parent route string
- [ ] `page.tsx` uses parent's DB controller and `FEATURE_KEYS`
- [ ] Hook imports `FEATURE_KEYS` + `api*` from parent's `utils/`
- [ ] Translation keys appended to existing files — no new files
- [ ] Sub-page has no `utils/`, `query-keys/`, `query-functions/`, or `db-controller/`

---

## Never Do This

```
❌ (sub-pages)/[feature]/[id]/utils/query-keys/index.ts   — duplicates FEATURE_KEYS, breaks cache invalidation
❌ (sub-pages)/[feature]/[id]/utils/query-functions/       — duplicates api* functions
❌ (sub-pages)/[feature]/[id]/db-controller/               — always use the parent's controller
❌ layout.tsx without backHref                             — router.back() breaks on deep links
❌ backHref set to router.back() workaround               — use the literal route string
```
