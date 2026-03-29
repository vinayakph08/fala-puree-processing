# Table Layer — TanStack Table

## Setup

TanStack Table is **not installed** in this project by default. Install before use:

```bash
npm install @tanstack/react-table
```

## When to Use

Use TanStack Table when you need:
- Client-side sorting by column
- Client-side filtering / global search
- Pagination across a flat list of items

For simple read-only lists without sorting/filtering, a plain `<ul>` or `<Table>` with `map()` is sufficient — no TanStack needed.

## Column Definitions

Define columns **outside the component** so the array reference is stable across renders:

```tsx
const getColumns = (
  onDelete: (id: string) => void,
): ColumnDef<IFeatureItem>[] => [
  {
    accessorKey: "name",
    header: () => "Name",
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    id: "actions",                   // non-data column — use `id`, no `accessorKey`
    header: () => "",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="sm"
        className="min-h-[44px] min-w-[44px]"
        onClick={() => onDelete(row.original.id)}
      >
        Delete
      </Button>
    ),
    enableSorting: false,
  },
];
```

Rules:
- Data columns use `accessorKey` (matches the property key on the row object)
- Action/computed columns use `id` only
- `cell` receives the full row via `row.original` — use for IDs and non-displayed fields

## Table Instance

```tsx
const table = useReactTable({
  data,
  columns,
  state: { sorting, columnFilters, globalFilter },
  onSortingChange: setSorting,
  onColumnFiltersChange: setColumnFilters,
  onGlobalFilterChange: setGlobalFilter,
  getCoreRowModel: getCoreRowModel(),          // always required
  getSortedRowModel: getSortedRowModel(),      // add when sorting needed
  getFilteredRowModel: getFilteredRowModel(),  // add when filtering needed
  getPaginationRowModel: getPaginationRowModel(), // add for pagination; remove if not needed
  initialState: { pagination: { pageSize: 10 } },
});
```

Only import the row model functions you actually use — unused ones add bundle weight.

## Rendering

```tsx
<Table>
  <TableHeader>
    {table.getHeaderGroups().map((headerGroup) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
            className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
          >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {header.column.getIsSorted() === "asc" && " ↑"}
            {header.column.getIsSorted() === "desc" && " ↓"}
          </TableHead>
        ))}
      </TableRow>
    ))}
  </TableHeader>
  <TableBody>
    {table.getRowModel().rows.length ? (
      table.getRowModel().rows.map((row) => (
        <TableRow key={row.id}>
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-24 text-center">
          No items are available
        </TableCell>
      </TableRow>
    )}
  </TableBody>
</Table>
```

Always display empty state inside `<TableBody>` (not outside the table) so column widths stay consistent.

## Pagination Controls

```tsx
<Button
  variant="outline"
  size="sm"
  className="min-h-[44px]"
  onClick={() => table.previousPage()}
  disabled={!table.getCanPreviousPage()}
>
 Prev
</Button>
<Button
  variant="outline"
  size="sm"
  className="min-h-[44px]"
  onClick={() => table.nextPage()}
  disabled={!table.getCanNextPage()}
>
  Next
</Button>
```

## Global Search Input

```tsx
<Input
  placeholder="Enter item name"
  value={globalFilter}
  onChange={(e) => setGlobalFilter(e.target.value)}
  className="max-w-sm"
/>
```

`globalFilter` searches across all `accessorKey` columns simultaneously. For per-column filtering, use `columnFilters` state and `column.setFilterValue()` per column.

## Translation Keys to Add

```json
{
  "table": {
    "searchPlaceholder": "...",
    "empty": "...",
    "columns": {
      "name": "...",
      "status": "...",
      "createdAt": "...",
      "actions": "..."
    },
    "actions": { "delete": "..." },
    "pagination": {
      "prev": "...",
      "next": "...",
      "page": "Page {{current}} of {{total}}"
    }
  }
}
```

## Full Template

See [table.template.tsx](../assets/table.template.tsx)
