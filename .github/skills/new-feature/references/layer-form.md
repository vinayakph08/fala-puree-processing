# Form Layer — React Hook Form +  Zod + Shadcn + Server Action

## When to Use

Any component collecting multiple fields from the user. Single-click actions (delete, toggle) use `useMutation` instead — no form needed.

## Stack

- `react-hook-form` — form state, validation, submission
- `@hookform/resolvers/zod` — connect Zod schema to RHF
- Shadcn `<Form>` components — consistent markup and accessible error display
- Server Action — receives `FormData`, validates again server-side, calls DB Controller

## Setup

```tsx
const form = useForm<CreateFeatureFormData>({
  resolver: zodResolver(createFeatureSchema),   // schema from utils/index.ts
  defaultValues: { name: "", status: "active" },
});
```

**Edit forms only** — never pass undefined as `defaultValues`. Always set safe empty values, then populate with `useEffect`:

```tsx
useEffect(() => {
  if (item) form.reset({ name: item.name, status: item.status });
}, [item, form]);
```

## Submission Pattern

```tsx
const onSubmit = async (data: CreateFeatureFormData) => {
  setIsSubmitting(true);
  try {
    const formData = new FormData();
    formData.append("name", data.name);

    const result = await createFeatureAction(formData);

    if (result.error) {
      toast.error(t("form.toast.error"));
      return;
    }
    toast.success(t("form.toast.success"));
    queryClient.invalidateQueries({ queryKey: FEATURE_KEYS.all });
    form.reset();
    setOpen(false);
  } catch {
    toast.error(t("form.toast.error"));
  } finally {
    setIsSubmitting(false);
  }
};
```

Key rules:
- `setIsSubmitting(true/false)` around the async call — show disabled button
- Check `result.error` before assuming success
- Invalidate **all** query keys for this feature after mutation
- Call `form.reset()` on success — clear field state

## Shadcn Form JSX Structure

Always wrap in `<Form {...form}>` and use `<FormField>` + `<FormItem>` + `<FormLabel>` + `<FormControl>` + `<FormMessage>`. Never build raw `<input>` + manual error `<p>`.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

    <FormField
      control={form.control}
      name="name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t("form.fields.name")}</FormLabel>
          <FormControl>
            <Input placeholder={t("form.fields.namePlaceholder")} {...field} />
          </FormControl>
          <FormMessage />   {/* ← shows Zod error, auto-cleared when valid */}
        </FormItem>
      )}
    />

  </form>
</Form>
```

## Field Recipes

### Select (enum values)
```tsx
<Select onValueChange={field.onChange} value={field.value}>
  <FormControl>
    <SelectTrigger className="w-full">
      <SelectValue placeholder={t("form.fields.statusPlaceholder")} />
    </SelectTrigger>
  </FormControl>
  <SelectContent>
    <SelectItem value="active">{t("status.active")}</SelectItem>
  </SelectContent>
</Select>
```

### Number Input (avoid `valueAsNumber` — handle empty string manually)
```tsx
<Input
  type="number"
  min={1}
  value={field.value ?? ""}
  onChange={(e) => {
    const v = e.target.value;
    field.onChange(v === "" ? undefined : Number(v));
  }}
/>
```

### Date Picker (Calendar + Popover)
```tsx
<Popover>
  <PopoverTrigger asChild>
    <FormControl>
      <Button variant="outline" className="w-full pl-3 text-left font-normal min-h-[44px]">
        {field.value ? format(field.value, "PPP") : <span>{t("form.fields.datePlaceholder")}</span>}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
    </FormControl>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start">
    <Calendar
      mode="single"
      selected={field.value}
      onSelect={(date) => date && field.onChange(date)}
      className="p-3 pointer-events-auto"
    />
  </PopoverContent>
</Popover>
```

## Dialog Wrapper Pattern

Wrap forms in `<Dialog>` for create/edit flows. Reset on close:

```tsx
const handleOpenChange = (next: boolean) => {
  if (!next) form.reset();
  setOpen(next);
};
```

Do not rely on `onOpenChange` alone — explicitly reset so dirty fields don't persist if the user reopens the dialog.

## Accessibility & UX

- All buttons: `min-h-[44px]` touch target
- Disabled state on submit button while `isSubmitting`
- `<FormMessage />` automatically shows and clears translated Zod error
- Always provide Cancel button — closes dialog and resets form

## Full Template

See [form.template.tsx](../assets/form.template.tsx)
