# 🚜 Fala Puree Processing and Quality Check App - Copilot Instructions

## 📋 Table of Contents

- [Project Context](#-project-context)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Internationalization (Kannada/English)](#-internationalization-kannadaenglish)
- [Mobile & PWA Rules](#-mobile--pwa-rules)
- [Farmer UX Patterns](#-farmer-ux-patterns)
- [Code Quality Standards](#-code-quality-standards)
- [Component Patterns](#-component-patterns)
- [Performance & Optimization](#-performance--optimization)
- [Quick Reference](#-quick-reference)
- [Common Mistakes to Avoid](#-common-mistakes-to-avoid)

---

## 🎯 Project Context

This is a **NextJS PWA** to produce, track and quality check spinach puree:

- **Puree Processing**: Measure and track spinach batches through clearning, blanching, chopping, grinding and packaging stages.
- **Quality Check**: Capture photos and details of each batch, track quality metrics, and flag issues for review.

**Key Goal**: Quick MVP for validation, lean and minimal approach

---

## 🛠 Tech Stack & Architecture

### Core Technologies

- **NextJS 15** with App Router
- **TypeScript** (strict mode enabled)
- **Tailwind CSS** for styling
- **Shadcn UI** components for consistent design
- **MongoDB** for database management
- **React Hook Form** with **Zod** for form validation
- **TanStack React Query** for data fetching
- **Next.js Image** component for image optimization
- **React Context** for global state management
- **PWA** capabilities with offline support

### Architecture Principles

- Mobile-first responsive design
- Offline-first data handling
- Progressive enhancement patterns
- Component-based architecture
- Type-safe development

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

### 2. Supabase & DB Controller

#### a. Client Rules — Security Critical

| Layer                                   | Client                                     |
| --------------------------------------- | ------------------------------------------ |
| DB Controller, API Route, Server Action | `createServerClient` from `@supabase/ssr`  |
| Client Components (browser only)        | `createBrowserClient` from `@supabase/ssr` |

**Service Role Key** → Admin app only. **Never** in the farmer-facing app.

#### b. DB Controller Pattern

```typescript
// src/app/(protected)/[feature]/db-controller/index.ts

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export class InventoryController {
  private supabase: SupabaseClient;

  constructor() {
    const cookieStore = cookies();
    this.supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { get: (name) => cookieStore.get(name)?.value } },
    );
  }

  // Always return { data, error } — never throw
  async getInventoryItems(): Promise<{
    data: InventoryItem[] | null;
    error: any;
  }> {
    const { data, error } = await this.supabase
      .from("farmer_inventory")
      .select("*")
      .order("created_at", { ascending: false });
    return { data, error };
  }

  async createInventoryItem(payload: InventoryInsert) {
    const { data, error } = await this.supabase
      .from("farmer_inventory")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  }
}
```

**DB Controller Rules:**

- Always class-based: `[Feature]Controller`
- Always return `{ data, error }` — never throw, never expose raw Supabase errors
- `data` will always has this structure: `{success: boolean, data: T | null | []}` — never return raw data or raw error
- No auth checks, no business logic — pure DB operations only
- Create client once in constructor — never inside individual methods
- Instantiate per request — never share a singleton

#### c. Row Level Security — Every Table

```sql
ALTER TABLE farmer_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Farmers view own inventory"
ON farmer_inventory FOR SELECT
USING (
  farmer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'FARMER'
  )
);
-- Repeat pattern for INSERT (WITH CHECK), UPDATE, DELETE
```

**RLS is non-negotiable on every table. No exceptions.**

#### d. Type Strategy

```typescript
// src/types/inventory.ts — manual domain types during MVP
export type InventoryItem = {
  id: string;
  farmerId: string;
  cropName: string;
  quantity: number;
  unit: "kg" | "quintal" | "ton";
  harvestDate: string;
  notes?: string;
  createdAt: string;
};
export type InventoryInsert = Omit<InventoryItem, "id" | "createdAt">;
export type InventoryUpdate = Partial<InventoryInsert>;
```

---

### 3. API Routes

```typescript
// src/app/api/inventory/route.ts

export async function GET(request: Request) {
  try {
    // 1. Auth check ALWAYS first
    const user = await getUserFromServerSide();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const controller = new InventoryController();
    const { data, error } = await controller.getInventoryItems();

    if (error) {
      console.error("[GET /api/inventory]", error);
      return NextResponse.json(
        { error: "Failed to fetch inventory" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[GET /api/inventory] Unexpected:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
```

**API Route Rules:**

- Auth check is always the first line — before any DB call
- Wrap every handler in try/catch
- Return `{ data, error:null }` on success, `{ data: null, error }` on failure — always this shape
- Use correct HTTP status codes: 401 (unauthed), 403 (forbidden), 404 (not found), 400 (bad request), 500 (server error)
- Never expose raw Supabase error messages to the client
- Log all errors with route context: `[METHOD /api/route]`
- Never call another API Route from within an API Route

---

### 4. React Query — Data Fetching & Mutations

#### Query Keys — Always Hierarchical Constants

```typescript
// src/app/(protected)/inventory/utils/query-functions/inventory-keys.ts
export const INVENTORY_KEYS = {
  all: ["inventory"],
  filtered: (filters: InventoryFilters) => ["inventory", filters],
  detail: (id: string) => ["inventory", id],
};
```

#### Query Utility Functions

```typescript
// src/app/(protected)/inventory/utils/query-functions/get-inventory.ts
export const getInventory = async (filters: InventoryFilters) => {
  const params = new URLSearchParams(filters as Record<string, string>);
  const response = await fetch(`/api/inventory?${params}`);

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error ?? "Failed to fetch inventory"); // always throw — never return error silently
  }

  const { data } = await response.json();
  return data;
};
```

#### Custom Hook Pattern

```typescript
// src/app/(protected)/inventory/hooks/use-inventory.tsx
"use client";

export const useInventory = (filters: InventoryFilters) => {
  const queryClient = useQueryClient();
  const t = useTranslations("inventory");
  const tCommon = useTranslations("common");

  const query = useQuery({
    queryKey: INVENTORY_KEYS.filtered(filters),
    queryFn: () => getInventory(filters),
    staleTime: 1000 * 60 * 5, // always set explicitly
    retry: 2, // queries retry; mutations do not
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteInventoryItem(id),
    onSuccess: () => {
      toast.success(t("messages.deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all }); // invalidate parent key
    },
    onError: (error: Error) => {
      toast.error(error.message ?? tCommon("errors.deleteFailed"));
      console.error("[deleteInventoryItem mutation]", error);
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    deleteInventoryItem: deleteMutation.mutateAsync, // always mutateAsync — never mutate
  };
};
```

#### Server Component Prefetch Pattern

```typescript
// src/app/(protected)/inventory/page.tsx — Server Component
export default async function InventoryPage() {
  const queryClient = new QueryClient()
  const controller = new InventoryController()

  await queryClient.prefetchQuery({
    queryKey: INVENTORY_KEYS.all,
    queryFn: () => controller.getInventoryItems(), // DB Controller directly on server
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <InventoryList />
    </HydrationBoundary>
  )
}
```

#### staleTime Convention

| Data Type                           | staleTime                 |
| ----------------------------------- | ------------------------- |
| Frequently changing (orders, tasks) | `1000 * 60 * 1` — 1 min   |
| Moderately changing (inventory)     | `1000 * 60 * 5` — 5 min   |
| Rarely changing (profile, config)   | `1000 * 60 * 30` — 30 min |

#### Cache Invalidation Rules

| Operation       | Invalidate                                     |
| --------------- | ---------------------------------------------- |
| Add / delete    | `FEATURE_KEYS.all`                             |
| Update / toggle | `FEATURE_KEYS.all` + `FEATURE_KEYS.detail(id)` |

---

### 4. Server Actions & Forms

#### Schema First — Always

```typescript
// src/app/(protected)/inventory/utils/inventory-schema.ts
import { z } from "zod";

export const addInventorySchema = z.object({
  cropName: z.string().min(1, { message: "validation.required" }), // translation key — never raw English
  quantity: z.number().min(0.1, { message: "validation.required" }),
  unit: z.enum(["kg", "quintal", "ton"]),
  harvestDate: z.string().min(1, { message: "validation.required" }),
  notes: z.string().optional(),
});

export type AddInventoryFormData = z.infer<typeof addInventorySchema>; // always inferred — never manual
```

#### Server Action Pattern

```typescript
// src/app/(protected)/inventory/server-actions/index.ts
"use server";

export async function addInventoryAction(data: AddInventoryFormData) {
  // 1. Server-side validation — always, even if client already validated
  const validated = addInventorySchema.safeParse(data);
  if (!validated.success) {
    return { success: false, error: validated.error.flatten().fieldErrors };
  }

  // 2. DB Controller directly — never call API Route from Server Action
  const controller = new InventoryController();
  const { error } = await controller.createInventoryItem(validated.data);

  if (error) {
    console.error("[addInventoryAction]", error);
    return { success: false, error: { general: "errors.saveFailed" } }; // translation key — not raw message
  }

  // 3. Revalidate server cache
  revalidatePath("/inventory");
  return { success: true, error: null };
}
```

#### Form Component Pattern

```typescript
// React Hook Form + Shadcn Form + Server Action
const form = useForm<AddInventoryFormData>({
  resolver: zodResolver(addInventorySchema),
  defaultValues: {
    cropName: "",
    quantity: 0,
    unit: "kg",
    harvestDate: "",
    notes: "",
  },
});

const onSubmit = async (data: AddInventoryFormData) => {
  const result = await addInventoryAction(data);

  if (result.success) {
    toast.success(t("messages.addSuccess"));
    queryClient.invalidateQueries({ queryKey: INVENTORY_KEYS.all }); // invalidate RQ cache
    form.reset();
  } else {
    toast.error(tCommon("errors.saveFailed"));
  }
};
```

**Edit forms:** Use empty `defaultValues` + `useEffect(() => { if (data) form.reset(data) }, [data])` — never pass undefined directly.

**Shadcn Form JSX:** Always use `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>`. Never build raw form layout.

---

### 5. Components & UI

#### Component Template

```typescript
// Named export always — never default export
import { useTranslations } from "next-intl"
import { FC } from "react"

interface InventoryCardProps {
  item: InventoryItem           // no `any` types
  onDelete: (id: string) => Promise<void>
}

export const InventoryCard: FC<InventoryCardProps> = ({ item, onDelete }) => {
  const t = useTranslations("inventory")
  const tCommon = useTranslations("common")

  return (
    <div className="rounded-lg border p-4"> {/* mobile-first base, md:/lg: for larger */}
      <h3>{item.cropName}</h3>
      <Button
        variant="destructive"
        onClick={() => onDelete(item.id)}
        className="min-h-[44px] min-w-[44px]" // 44px minimum touch target — always
      >
        {tCommon("buttons.delete")}
      </Button>
    </div>
  )
}
```

#### Async Data States — All Three Required

```typescript
if (isLoading) return <InventoryListSkeleton />           // skeleton — never inline spinner
if (error) return <ErrorMessage message={t("errors.loadFailed")} />
if (!data?.length) return <EmptyState message={t("inventory.page.empty")} />

return <InventoryList data={data} />
```

#### Shadcn Extension Rule

Never override Shadcn components with one-off `className`. Always extend via named variants.

```typescript
// ✅ Correct — variant in component file
const buttonVariants = cva("...", {
  variants: { variant: { farmAction: "bg-green-600 hover:bg-green-700 text-white" } }
})
<Button variant="farmAction">Mark Harvested</Button>

// ❌ Wrong — one-off override
<Button className="bg-green-600 hover:bg-green-700 text-white">Mark Harvested</Button>
```

#### State Placement Decision

```
Is it server data?          → React Query (never copy into state/Zustand/Context)
Local UI only?              → useState
Shared across 2-3 siblings? → Lift to parent
Feature-wide?               → React Context scoped to feature
App-wide UI (modals, notif) → Zustand
```

#### Component Extraction Triggers

Extract immediately when **any one** is true: (1) same markup in 2+ places, (2) markup obscures parent intent, (3) piece has its own logic/state.

#### Config Maps

Status-to-style mappings live in utility files — never inline conditionals.

```typescript
// src/utils/config/status-config.ts
export const inventoryStatusConfig: Record<InventoryStatus, string> = {
  available: "bg-green-100 text-green-800",
  reserved: "bg-yellow-100 text-yellow-800",
  sold: "bg-red-100 text-red-800",
};
```

---

### 6. Error Handling

#### Error Flow

```
DB Controller  → return { data: null, error }
API Route      → NextResponse with correct status code
Server Action  → return { success: false, error }
React Query    → populate error state, trigger onError toast
Component      → translated toast + Error Boundary fallback
```

#### Error Boundaries — Two Levels Required

```typescript
// Page level — in layout.tsx
<ErrorBoundary fallback={<PageErrorFallback />}>{children}</ErrorBoundary>

// Section level — in page.tsx, one per major section
<ErrorBoundary fallback={<SectionErrorFallback />}><InventoryList /></ErrorBoundary>
<ErrorBoundary fallback={<SectionErrorFallback />}><InventoryStats /></ErrorBoundary>
```

#### Error Translation Keys Convention

```
errors.loadFailed          errors.saveFailed          errors.deleteFailed
errors.unauthorized        errors.forbidden            errors.notFound
errors.pageError.title     errors.pageError.message   errors.pageError.retry
errors.sectionError.message
```

#### Logging Convention

Always include context: `[METHOD /api/route]`, `[actionName]`, `[mutationName mutation]`, `[ErrorBoundary caught]`

---

### Form Validation & Messages

- All validation messages must be translated
- Use Zod with custom error messages in both languages
- Handle number and currency formatting differences
- Include context comments for translators

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

## 🔧 Code Quality Standards

### TypeScript Usage

- Always use **TypeScript with strict mode**
- Define **proper interfaces** for all props and data structures
- Use **type guards** for runtime type checking
- Implement **error boundaries** and comprehensive error handling
- **No any types** - use proper typing

### Component Standards

- Create **reusable components** for common farmer actions
- Use **React Hook Form** for all form management
- Implement **React.memo** for expensive components
- Add **loading and error states** to all data fetching
- Follow **single responsibility principle**

### Data Management

- Always **validate data** with Zod schemas
- Implement **optimistic updates** for better UX
- Use **SWR or TanStack Query** for data fetching
- Store **sensitive data securely** (no plaintext storage)
- Handle **network failures gracefully**

---

## 🏗 Component Patterns

### Naming Conventions

-
- **PascalCase** for components: `FarmerInventoryCard`
- **camelCase** for functions and variables `getInventoryData`
- **UPPER_SNAKE_CASE** for constants
- **kebab-case** for file and folder names: `farmer-inventory-card.tsx`
- **kebab-case** for file and folder names: `inventory | inventory-table-card/index.tsx | inventory-form/index.tsx`

### Component Template

```typescript
import { useTranslations } from "next-intl";
import { FC } from "react";

interface ComponentProps {
  // Define all props with proper types
}

export const ComponentName: FC<ComponentProps> = ({ prop1, prop2 }) => {
  const t = useTranslations("feature");

  return (
    <div className='mobile-first-classes'>
      <h2>{t("title")}</h2>
      {/* Component content */}
    </div>
  );
};
```

---

## ⚡ Performance & Optimization

### Image Optimization

- Use **WebP format** with fallbacks
- Implement **lazy loading** for images
- **Compress images** for mobile networks
- Use **Next.js Image** component
- **Responsive images** with proper srcSet

### Code Optimization

- Implement **code splitting** for route-based chunks
- **Minimize bundle size** - prefer native browser APIs
- Use **React.memo** and **useMemo** appropriately
- Add proper **caching strategies**
- **Tree-shake** unused dependencies

### Network Optimization

- **Offline-first** approach for critical features
- **Progressive data loading**
- **Request deduplication**
- **Proper error retry** mechanisms
- **Background sync** for offline actions

---

## 📝 Quick Reference

### Touch Targets

```css
/* ✅ Correct - Minimum 44px */
.btn { min-h-[44px] min-w-[44px] }

/* ❌ Wrong - Too small */
.btn { h-8 w-8 }
```

### Currency Formatting

```typescript
// ✅ Correct
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);

// ❌ Wrong
`₹${amount}`;
```

### Loading States

```typescript
// ✅ Always include loading states
{
  isLoading ? <div>{t("common.loading")}</div> : <DataComponent data={data} />;
}
```

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't Do This

- Use small touch targets (< 44px)
- Skip loading states on async operations
- Store sensitive data in localStorage without encryption
- Use `any` type in TypeScript
- Ignore offline scenarios
- Create components without proper error boundaries
- Skip image optimization
- Use complex forms without proper validation
- Forget to test with real Kannada text

### ✅ Always Do This

- Extract all text to translation files
- Use large, touch-friendly buttons
- Show loading and error states
- Implement proper error handling
- Use strict TypeScript typing
- Design for offline-first scenarios
- Add proper error boundaries
- Optimize images for mobile
- Use React Hook Form with Zod validation
- Test with actual Kannada agricultural terminology

---

### Code Response Rules.

1. Generated code and explaination should be Consice and Straight Forward without verbose this. Just give me what I asked for.
2. Don't generate kannada text in code snippets, only use English for code. Generate kannada text only in translation files.
