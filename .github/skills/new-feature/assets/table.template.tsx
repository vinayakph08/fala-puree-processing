// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/components/[feature]-table/index.tsx
//
// SETUP: TanStack Table is not installed by default. Run:
//   npm install @tanstack/react-table
//
// Replace [feature] and column definitions throughout.

"use client";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { IFeatureItem } from "@/types/feature";

// ─── Column Definitions ───────────────────────────────────────────────────────
// Define outside the component — stable reference, not re-created on every render.

const getColumns = (
  t: ReturnType<typeof useTranslations>,
  onDelete: (id: string) => void,
): ColumnDef<IFeatureItem>[] => [
  {
    accessorKey: "name",
    header: () => t("table.columns.name"),
    cell: ({ row }) => <span>{row.getValue("name")}</span>,
  },
  {
    accessorKey: "status",
    header: () => t("table.columns.status"),
    cell: ({ row }) => {
      const status = row.getValue<string>("status");
      return <span>{t(`status.${status}`)}</span>;
    },
  },
  {
    accessorKey: "created_at",
    header: () => t("table.columns.createdAt"),
    cell: ({ row }) => {
      const date = new Date(row.getValue<string>("created_at"));
      return <span>{date.toLocaleDateString("en-IN")}</span>;
    },
  },
  {
    id: "actions",
    header: () => t("table.columns.actions"),
    cell: ({ row }) => (
      <Button
        variant="destructive"
        size="sm"
        className="min-h-[44px] min-w-[44px]"
        onClick={() => onDelete(row.original.id)}
      >
        {t("table.actions.delete")}
      </Button>
    ),
    enableSorting: false,
  },
];

// ─── Table Component ──────────────────────────────────────────────────────────

interface FeatureTableProps {
  data: IFeatureItem[];
  onDelete: (id: string) => void;
}

export const FeatureTable = ({ data, onDelete }: FeatureTableProps) => {
  const t = useTranslations("feature");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = getColumns(t, onDelete);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),    // remove if no pagination needed
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="space-y-4">

      {/* Search / Filter bar */}
      <Input
        placeholder={t("table.searchPlaceholder")}
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-sm"
      />

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
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
                    {/* Sort indicator */}
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
                  {t("table.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination — remove this block if getPaginationRowModel() is not used */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          {t("table.pagination.page", {
            current: table.getState().pagination.pageIndex + 1,
            total: table.getPageCount(),
          })}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px]"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("table.pagination.prev")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px]"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("table.pagination.next")}
          </Button>
        </div>
      </div>

    </div>
  );
};
