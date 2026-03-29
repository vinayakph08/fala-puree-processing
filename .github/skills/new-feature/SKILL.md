---
name: new-feature
description: "Use when building a new feature, page, module, or section end-to-end. Covers all 4 layers: types, db-controller, api-route, server-action, react-query hook, components, page, and translations. Invoke when user says create feature, build page, add module, implement screen."
argument-hint: "Feature name (e.g. tasks, orders, notifications)"
---

# New Feature — End-to-End Build

## When to Use

Invoke when building any new feature from scratch that needs all layers:
DB → API → Hook → UI → Translations.

## Before Starting

Check if a Google Stitch screen design was provided in context. If yes, use it as the UI specification. If not, ask the user to describe the screen layout before proceeding.

## Directory Structure to Create

```
src/
├── types/
│   └── [feature].ts                                    ← Step 1
├── app/
│   ├── (protected)/(main-pages)/[feature]/
│   │   ├── layout.tsx                                  ← Step 7 (optional, if custom layout needed)
│   │   ├── page.tsx                                    ← Step 7
│   │   ├── db-controller/
│   │   │   └── index.ts                                ← Step 2
│   │   ├── utils/
│   │   │   ├── index.ts                                ← Step 3 (Zod schemas only)
│   │   │   ├── query-keys/
│   │   │   │   └── index.ts                            ← Step 3 (FEATURE_KEYS constants)
│   │   │   ├── query-functions/
│   │   │   │   └── index.ts                            ← Step 3 (fetch* — client API callers for hooks)
│   │   │   └── server-functions/
│   │   │       └── index.ts                            ← Step 3 (get* — DB controller wrappers for page.tsx)
│   │   ├── server-actions/
│   │   │   └── index.ts                                ← Step 4
│   │   ├── hooks/
│   │   │   └── use-[feature].tsx                       ← Step 5
│   │   └── components/
│   │       ├── client-component/index.tsx              ← Step 7
│   │       └── [other-components]/index.tsx            ← Step 7
│   └── api/
│       └── [feature]/
│           ├── route.ts                                ← Step 6
│           └── search/
│               └── route.ts                            ← Step 6 (optional, if search needed)
└── public/locales/
    ├── en/[feature].json                               ← Step 8
    └── kn/[feature].json                               ← Step 8
```

## Build Steps — Follow in Order

### Step 1 — Types
Create domain types in `src/types/[feature].ts`. Export from `src/types/index.ts`.
See [types reference](./references/layer-types.md) | [template](./assets/types.template.ts)

### Step 2 — DB Controller
Create `db-controller/index.ts`. Pure DB operations only, no auth, no business logic.
See [db-controller reference](./references/layer-db-controller.md) | [template](./assets/db-controller.template.ts) | [data-shapes reference](./references/data-shapes.md)

### Step 3 — Utils (Query Keys, Schemas, Wrapper Functions)
Three files in `utils/`:

- `utils/query-keys/index.ts` — `FEATURE_KEYS` constants (imported by hooks + page.tsx)
- `utils/index.ts` — Zod schemas only (imported by server-actions + hooks)
- `utils/server-functions/index.ts` — `db*` functions wrapping DB controller (used in page.tsx prefetch)
- `utils/query-functions/index.ts` — `api*` functions calling API routes (used in hooks)

See [query-keys reference](./references/query-keys.md) | [query-keys template](./assets/query-keys.template.ts) | [utils template](./assets/utils.template.ts) | [server-functions template](./assets/server-functions.template.ts) | [query-functions template](./assets/query-functions.template.ts)

### Step 4 — Server Actions
Create `server-actions/index.ts`. Uses Zod schemas from `utils/index.ts`.
See [server-actions reference](./references/layer-server-action.md) | [template](./assets/server-action.template.ts)

### Step 5 — React Query Hook
Create `hooks/use-[feature].tsx`. Uses `api*` from `utils/query-functions/` and FEATURE_KEYS from `utils/query-keys/`.
See [hook reference](./references/layer-hook.md) | [template](./assets/hook.template.ts)

### Step 6 — API Route
Create `src/app/api/[feature]/route.ts` using the main template.

**Decision — does the feature need text search, filtering, or pagination?**
- **No** → only `route.ts` needed
- **Yes** → also create `src/app/api/[feature]/search/route.ts` using the search template

See [api-route reference](./references/layer-api-route.md) | [template](./assets/api-route.template.ts) | [search template](./assets/api-route-search.template.ts)

### Step 7 — Layout + Page + Components
- `layout.tsx` — only if the feature needs a custom header, nav, or wrapper different from the main layout
- `page.tsx` — Server Component, uses `Promise.allSettled` + `get*` from `utils/server-functions/`
- `components/client-component/` — root client component consuming the hook
- Other components as needed

**Does the feature have a form (create/edit)?**
- **Yes** → build with React Hook Form + Shadcn `<Form>` + Server Action — see form reference and template
- **No** → skip

**Does the feature display a list that needs sorting, filtering, or pagination?**
- **Yes** → use TanStack Table — run `npm install @tanstack/react-table` first, then see table reference and template
- **No** → simple `map()` over the array is enough

See [component reference](./references/layer-component.md) | [form reference](./references/layer-form.md) | [table reference](./references/layer-table.md) | [page template](./assets/page.template.tsx) | [form template](./assets/form.template.tsx) | [table template](./assets/table.template.tsx)

### Step 8 — Translations
Create both `public/locales/en/[feature].json` and `public/locales/kn/[feature].json`.
See [translation template](./assets/translations.template.json)

## Checklist Before Finishing

- [ ] Types defined with no `any` — exported from `src/types/index.ts`
- [ ] DB Controller returns `{ data, error }` from every method — never throws
- [ ] `utils/query-keys/index.ts` has FEATURE_KEYS — imported from there by hooks and page.tsx
- [ ] `utils/index.ts` has Zod schemas only — no types, no FEATURE_KEYS
- [ ] `server-functions` use `get*` prefix — only called server-side
- [ ] `query-functions` use `fetch*` prefix — only called client-side from hooks
- [ ] API Route has auth check as the first statement in every handler
- [ ] Server Action has `"use server"` + Zod validation + `revalidatePath`
- [ ] Hook uses `fetch*` from `query-functions`, imports FEATURE_KEYS from `utils`
- [ ] Page uses `Promise.allSettled` + `get*` from `server-functions` for prefetch
- [ ] Page wraps children in `HydrationBoundary`
- [ ] Components handle all 3 async states (loading skeleton / error / empty)
- [ ] All interactive elements have `min-h-[44px]` touch targets
- [ ] Both `en` and `kn` translation files created
- [ ] Forms use `useForm` + `zodResolver` + Shadcn `<Form>` components — no raw `<input>` + manual errors
- [ ] Edit forms use `useEffect` to `form.reset(data)` — never pass `undefined` as `defaultValues`
- [ ] Dialogs call `form.reset()` in `handleOpenChange` on close — no stale field state
- [ ] Table column definitions defined outside the component (stable reference)
- [ ] `@tanstack/react-table` installed before using table template (`npm install @tanstack/react-table`)
