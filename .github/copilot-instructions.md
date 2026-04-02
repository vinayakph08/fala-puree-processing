# 🚜 Fala User App - Copilot Instructions

> Detailed coding patterns live in `.github/instructions/` (auto-loaded per file type) and `.github/skills/` (invoked on demand).
> This file is the always-loaded mental model — architecture, decisions, context, and hard rules.
> **Database migrations**: always invoke the `/create-migration` skill — it owns all SQL templates, naming rules, RLS patterns, and the post-generation checklist.

---

## 🎯 Project Context

This is a **NextJS PWA** for operators to manage spinach processing and quality control operations.
The app covers two core modules:

- **Processing**: Track spinach batches through each production stage and record stage-level measurements
- **Quality Testing**: Perform and record quality tests on batches, producing pass/fail, grade, score, and per-parameter results

**Target Users**: Processing workers, quality inspectors, and supervisors in a food processing facility.
**Business Model**: Spinach beauty processing — raw spinach in → packaged frozen spinach puree out.
**Language**: English only. No translations required.
**Key Goal**: Quick MVP for validation, lean and minimal approach

---

## 🛠 Tech Stack & Architecture

### Core Technologies

- **NextJS 15** with App Router
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **Shadcn UI** components for consistent design
- **Supabase** for database and authentication management
- **React Hook Form** with **Zod** for form validation
- **TanStack React Query** for data fetching
- **Next.js Image** component for image optimization
- **React Context** for global state management
- **PWA** capabilities with offline support

## 4-Layer Architecture

Every feature follows this exact data flow. No shortcuts.

```
[Write path — Form Submission]
Component → Server Action → DB Controller → Supabase

[Read / Single-action path]
Supabase → DB Controller → API Route → React Query Hook → Component
```

### 1. Layer Decision Table — Memorise This

| Situation                              | Correct Layer             |
| -------------------------------------- | ------------------------- |
| Form with multiple fields — create     | Server Action             |
| Form with multiple fields — update     | Server Action             |
| Fetching / reading data                | API Route + `useQuery`    |
| Delete button (single action, no form) | API Route + `useMutation` |
| Status toggle / approve / reject       | API Route + `useMutation` |

```typescript
// ❌ Wrong — using Server Action for a button click (no form)
<button onClick={() => markCompleteAction(id)}>Complete</button>

// ✅ Correct — use useMutation for single-click actions
const { markComplete } = useTask()
<button onClick={() => markComplete(id)}>Complete</button>

// ❌ Wrong — queryFn calling DB Controller directly
queryFn: () => controller.getItems()   // bypasses API Route

// ✅ Correct — queryFn always calls API Route
queryFn: () => getInventory(filters)   // API Route at /api/inventory
```

### 2. Supabase Client Rules — Security Critical

| Layer | Client |
|---|---|
| DB Controller, API Route, Server Action | `createClient` from `@/utils/supabase/server` |
| Client Components (browser only) | `createBrowserClient` from `@supabase/ssr` |

**Service Role Key** → Admin app only. **Never** in the user-facing app.
**RLS is non-negotiable on every table. No exceptions.**

### 3. Data Shape Transformation Chain

Every value flows through 4 boundaries. Each boundary either WRAPS or UNWRAPs:

```
DB Controller   → DbResult<T> = { data: T | null, error: string | null }
                      ↓ UNWRAP (server-function / api-route)
API Route body  → { data: T }  on success  |  { error: string } on failure
                      ↓ UNWRAP (query-function)
queryFn return  → T  (bare — React Query wraps it automatically)
                      ↓
useQuery        → { data: T | undefined, isLoading, error }
```

**The invariant:** `queryFn` must always return `T`, never `{ data: T }`. If you return a wrapper, the component reads `data.data`.

- DB Controller returns `DbResult<T>` — **never add `success: boolean`**, `error !== null` is the only failure signal
- `api*` functions (in `utils/query-functions/`) — call `/api/*` routes, UNWRAP `{ data: T }` → return `T`
- `db*` functions (in `utils/server-functions/`) — call DB controller directly, for `page.tsx` prefetch only

See `.github/skills/new-feature/references/data-shapes.md` for the full pattern with code.

### 4. Feature Directory Structure

```
src/
├── types/[feature].ts                              ← domain types + DbResult<T> in src/types/index.ts
└── app/(protected)/(main-pages)/[feature]/
    ├── page.tsx                                    ← Server Component, Promise.allSettled prefetch
    ├── db-controller/index.ts                      ← pure DB ops, singleton export
    ├── utils/
    │   ├── index.ts                                ← Zod schemas only
    │   ├── query-keys/index.ts                     ← FEATURE_KEYS constants
    │   ├── query-functions/index.ts                ← api* — client callers for hooks
    │   └── server-functions/index.ts               ← db* — DB controller wrappers for page.tsx
    ├── server-actions/index.ts                     ← form submissions only
    ├── hooks/use-[feature].tsx                     ← React Query hook
    └── components/                                 ← feature UI
```

### 5. Naming Conventions

- **PascalCase** for components: `InventoryCard`
- **camelCase** for functions/variables: `getUserData`
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for files/folders: `inventory-card/index.tsx`
- **`api*` prefix** for client query-functions: `apiGetFeatureList`, `apiDeleteFeature`
- **`db*` prefix** for server-functions: `dbGetFeatureList`, `dbGetFeatureById`

---

## 📱 Mobile & PWA Rules

### Mobile-First Development

- Always write **mobile-first responsive code**
- Use **large touch targets** (minimum 44px × 44px)
- Ensure **high contrast** for outdoor visibility
- Test on **basic Android browsers**
- Optimize for **slow network conditions**

### PWA Requirements

- Include proper **meta tags** for PWA in all pages
<!-- - Implement **service worker patterns** for offline functionality -->
- Use **localStorage** for offline data persistence
- Add proper **manifest.json** configurations
- Include **install prompts** and **offline indicators**
- Show **loading states** for all async operations

### Accessibility Standards

- Add proper **ARIA labels** and **semantic HTML**
- Use **clear visual hierarchy**
<!-- - Ensure **keyboard navigation** works
- Test with **screen readers** -->
- Maintain **focus management**

---

## 👨‍🌾 User UX Patterns

### User Experience Principles

- Use **simple, clear language** in UI text
- **Minimize text input** - prefer Icons, dropdowns, buttons, image uploads
- Show **clear feedback** for all user actions
- Implement **error recovery** patterns
- Use **familiar agricultural terminology**

### Data Input Patterns

- **Dropdown selections** over free text input
- **Quantity inputs** with clear units (kg, g)
- **Stage-by-stage forms** for recording measurements at each processing step
- **Touch-friendly** form controls sized for factory floor use

### Information Display

- **Batch status indicators** — which stage a batch is currently at
- **Per-stage measurement history** — color, texture, viscosity readings
- **Quality score cards** — per-parameter scores + overall grade
- **Pass / Fail badges** with grade (A/B/C) clearly visible
- **Simple charts** for batch throughput and quality trends

---

##  Common Mistakes to Avoid

### ❌ Don't Do This

- Use small touch targets (< 44px)
- Skip loading states on async operations
- Store sensitive data in localStorage without encryption
- Use `any` type in TypeScript
- Ignore offline scenarios
- Create components without proper error boundaries
- Skip image optimization
- Use complex forms without proper validation
- Return `{ success: boolean, data, error }` from DB Controller — use `DbResult<T>` = `{ data, error }` only
- Return `{ data: T }` from a `queryFn` — React Query wraps it again, component reads `data.data`
- Call `controller.method()` directly as `queryFn` in client hooks — use `api*` query-functions
- Define fetch logic inline in hooks — extract to `utils/query-functions/` with `api*` prefix
- Add search/filter logic to the main `route.ts` — use a separate `/search/route.ts`

### ✅ Always Do This

- Use large, touch-friendly buttons
- Show loading and error states (all three: loading / error / empty)
- Implement proper error handling
- Use strict TypeScript typing
- Design for offline-first scenarios
- Add proper error boundaries
- Optimize images for mobile
- Use React Hook Form with Zod validation
- Annotate DB Controller methods with `Promise<DbResult<T>>`
- Import `api*` functions from `utils/query-functions/` into hooks
- Use `db*` functions from `utils/server-functions/` in `page.tsx` prefetch
- Use `Promise.allSettled` for multiple `prefetchQuery` calls in page.tsx
- Put `FEATURE_KEYS` in `utils/query-keys/index.ts` — never inline in the hook file

---

## � Spinach Processing Domain

### Processing Pipeline (in order)

Every batch moves through these 7 stages in sequence:

| # | Stage | What's tracked |
|---|-------|----------------|
| 1 | Sorting & Cleaning | Input weight, waste removed |
| 2 | Blanching | Temperature, duration |
| 3 | Quenching | Temperature, duration |
| 4 | Cutting | Output weight |
| 5 | Grinding | Color, texture, viscosity measurements |
| 6 | Packaging | Output weight, grade assigned |
| 7 | Freezing | Final output weight, timestamp |

### Batch Data Model

Each batch tracks:
- `batch_id` — unique identifier
- `input_weight` — raw spinach in (kg)
- `output_weight` — puree produced (kg)
- `waste` — weight lost (kg)
- `grade` — A / B / C
- `timestamp` — when the batch was created/completed
- `color`, `texture`, `viscosity` — recorded at each relevant stage

**End product**: Spinach Puree (frozen, packaged)

### Quality Tests

The quality check module has **two test types** per batch. Each parameter produces:
- A **numeric score**
- A **Pass / Fail** result
- A **grade** (A / B / C)

#### 1. Standard Quality Check

| Parameter | What it measures |
|-----------|------------------|
| Color | Visual color grading of the puree |
| Texture | Consistency and smoothness |
| Viscosity | Flow and thickness |
| Taste & Flavour | Sensory evaluation |

#### 2. Cooking Stress Test

Simulates the puree under cooking conditions to validate stability:

| Parameter | What it measures |
|-----------|------------------|
| Color | Color retention after cooking |
| Taste | Flavour retention after cooking |

#### Data Capture

- **Camera image capture** is required for quality tests — inspectors photograph the sample as evidence
- Images are captured directly from the device camera (not gallery upload)
- Each test result is stored with its associated image(s)

**Overall batch quality result** = combination of all parameters across both test types → single Pass/Fail + Grade (A/B/C)

### User Roles

| Role | Responsibilities |
|------|------------------|
| Processing Worker | Logs and updates each processing stage for a batch |
| Quality Inspector | Performs quality tests and records results |
| Supervisor | Oversees both modules; can approve/reject batches |

### Business Flow Context

- Raw spinach → Processing stages → Spinach Puree → Quality Testing → Packaged frozen product
- Every batch stage and quality result must be linked to the `batch_id` for full traceability
- Supervisors can view batch history and quality test outcomes across all batches

### Code Response Rules

1. Generated code and explanation should be concise and straight forward. Just give me what I asked for.
2. English only — no Kannada text anywhere in the codebase.
