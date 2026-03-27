# 🚜 Fala Farmer App - Copilot Instructions

> Detailed coding patterns live in `.github/instructions/` (auto-loaded per file type) and `.github/skills/` (invoked on demand).
> This file is the always-loaded mental model — architecture, decisions, context, and hard rules.

---

## 🎯 Project Context

This is a **NextJS PWA** for farmers to manage their agricultural operations in Karnataka, India. The app helps farmers with:

- **Inventory Management**: Update and track harvested crops and quantities
- **Order Management**: View and fulfill customer orders
- **Earnings Tracking**: Monitor income and weekly earnings in Number and Graph formats
- **Task Management**: Complete agricultural tasks with validation by capturing photos

**Target Users**: Farmers in Karnataka who primarily speak Kannada. Later we can add Hindi, Tamil, and Telugu.
**Business Model**: Agritech supply chain connecting farmers directly with premium customers
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
- **next-intl** + `useTranslations` hook for internationalization
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

**Service Role Key** → Admin app only. **Never** in the farmer-facing app.
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

## 🌐 Internationalization (Kannada/English)

- **Default language**: Kannada (`kn`) — takes priority over English
- **All user-facing text** must be in translation files — never hardcode strings in components
- Translation files: `public/locales/{kn,en}/[feature].json`
- Use `useTranslations("feature")` hook — Zod validation messages also use translation keys
- Design for **20–40% longer text** in Kannada; use **English numerals** in Kannada context
- Currency: `new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" })`

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

## 👨‍🌾 Farmer UX Patterns

### User Experience Principles

- Use **simple, clear language** in UI text
- **Minimize text input** - prefer Icons, dropdowns, buttons, image uploads
- Show **clear feedback** for all user actions
- Implement **error recovery** patterns
- Use **familiar agricultural terminology**

### Data Input Patterns

- **Image uploads** for crop photos and task validation
- **Dropdown selections** over free text input
- **Date pickers** for harvest dates and schedules
- **Quantity inputs** with clear units (kg, tons, etc.)
- **Touch-friendly** form controls

### Information Display

- **Visual indicators** for order status, task completion
- **Clear earnings summaries** with rupee formatting
- **Simple charts** for earnings tracking
- **Photo galleries** for crop documentation
- **Step-by-step** task instructions

---

##  Common Mistakes to Avoid

### ❌ Don't Do This

- Hardcode English text in components
- Use small touch targets (< 44px)
- Skip loading states on async operations
- Store sensitive data in localStorage without encryption
- Use `any` type in TypeScript
- Ignore offline scenarios
- Create components without proper error boundaries
- Skip image optimization
- Use complex forms without proper validation
- Forget to test with real Kannada text
- Return `{ success: boolean, data, error }` from DB Controller — use `DbResult<T>` = `{ data, error }` only
- Return `{ data: T }` from a `queryFn` — React Query wraps it again, component reads `data.data`
- Call `controller.method()` directly as `queryFn` in client hooks — use `api*` query-functions
- Define fetch logic inline in hooks — extract to `utils/query-functions/` with `api*` prefix
- Add search/filter logic to the main `route.ts` — use a separate `/search/route.ts`

### ✅ Always Do This

- Extract all text to translation files
- Use large, touch-friendly buttons
- Show loading and error states (all three: loading / error / empty)
- Implement proper error handling
- Use strict TypeScript typing
- Design for offline-first scenarios
- Add proper error boundaries
- Optimize images for mobile
- Use React Hook Form with Zod validation
- Test with actual Kannada agricultural terminology
- Annotate DB Controller methods with `Promise<DbResult<T>>`
- Import `api*` functions from `utils/query-functions/` into hooks
- Use `db*` functions from `utils/server-functions/` in `page.tsx` prefetch
- Use `Promise.allSettled` for multiple `prefetchQuery` calls in page.tsx
- Put `FEATURE_KEYS` in `utils/query-keys/index.ts` — never inline in the hook file

---

## 🌱 Agricultural Context

### Common Terminology

- **Crops**: Spinach (ಪಾಲಕ್), Coriander (ಕೊತ್ತಂಬರಿ), Mint (ಪುದೀನ)
- **Units**: Kilograms (ಕಿಲೋಗ್ರಾಂ), Tons (ಟನ್), Bundles (ಕಟ್ಟುಗಳು)
- **Seasons**: Kharif, Rabi, Summer (refer to local seasonal patterns)
- **Quality Terms**: Fresh (ತಾಜಾ), Premium (ಪ್ರೀಮಿಯಂ), Grade A (ಗ್ರೇಡ್ ಎ)

### Business Flow Context

- Farmers → FPOs → Fala → Premium Customers
- Focus on quality over quantity
- Transparency in pricing and processes
- Direct farmer empowerment model

Remember: This app should feel natural to Karnataka farmers while being technically robust for scaling.

### Code Response Rules.

1. Generated code and explaination should be Consice and Straight Forward without verbose this. Just give me what I asked for.
2. Don't generate kannada text in code snippets, only use English for code. Generate kannada text only in translation files.
