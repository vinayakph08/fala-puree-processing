# Component & Page Layer

## Page Location

`src/app/(protected)/(main-pages)/[feature]/page.tsx`

## Page Rules

- Server Component — no `"use client"`
- Auth check via `getUserFromServerSide()` — redirect to `/` on failure
- Prefetch all queries needed by the page using the exported fetch functions from hooks
- Wrap children in `<HydrationBoundary state={dehydrate(queryClient)}>`
- Default export (Next.js requirement for pages)

## Components Location

`src/app/(protected)/(main-pages)/[feature]/components/`

```
components/
├── client-component/index.tsx   ← Root client component, consumes hooks
├── [feature]-card/index.tsx
├── [feature]-form/index.tsx
├── [feature]-list/index.tsx
└── [feature]-skeleton/index.tsx
```

## Component Rules

- Named exports — never default export (except page.tsx)
- `"use client"` on any component using hooks or event handlers
- Must handle all 3 async states: loading → skeleton, error → error message, empty → empty state
- All interactive elements: `min-h-[44px]` touch target

## Form Pattern (React Hook Form + Zod + Shadcn + Server Action)

For the full form pattern, field recipes (Select, Number, Date Picker), dialog reset rules, and edit-form `useEffect` population — see the dedicated [form reference](./layer-form.md) and [form template](../assets/form.template.tsx).

Quick summary:

```tsx
const form = useForm<CreateFeatureFormData>({
  resolver: zodResolver(createFeatureSchema),
  defaultValues: { name: "", status: "active" },
});

const onSubmit = async (data: CreateFeatureFormData) => {
  const result = await createFeatureAction(data);
  if (result.error) { toast.error(t("form.toast.error")); return; }
  toast.success(t("form.toast.success"));
  queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
  form.reset();
};
```

## Table Pattern (TanStack Table)

For sorting, filtering, and pagination — see the dedicated [table reference](./layer-table.md) and [table template](../assets/table.template.tsx).

Install first: `npm install @tanstack/react-table`

Use TanStack Table when the list needs client-side sorting/filtering/pagination. For simple read-only lists, `map()` over the data directly.

## Full Templates

- Page: [page.template.tsx](../assets/page.template.tsx)
- Form: [form.template.tsx](../assets/form.template.tsx)
- Table: [table.template.tsx](../assets/table.template.tsx)
