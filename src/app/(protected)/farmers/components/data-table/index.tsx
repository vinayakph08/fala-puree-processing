"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IFarmers } from "./columns";

interface DataTableProps<TData extends { id: string | number }, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  updatePagination: (pagination: { page: number; pageSize: number }) => void;
}

export function DataTable<TData extends { id: string | number }, TValue>({
  columns,
  data,
  pagination,
  updatePagination,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const router = useRouter();
  const table = useReactTable({
    data: data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function"
          ? updater({
              pageIndex: pagination.page,
              pageSize: pagination.pageSize,
            })
          : updater;
      updatePagination({
        page: newPagination.pageIndex,
        pageSize: newPagination.pageSize,
      });
    },
    pageCount: pagination.totalPages, // Unknown page count
    state: {
      // columnFilters,
      pagination: {
        pageIndex: pagination.page,
        pageSize: pagination.pageSize,
      },
    },
  });

  const handleOnRowClick = (row: TData) => {
    router.push(`/farmers/${row?.id}`);
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      updatePagination({
        page: pagination.page - 1,
        pageSize: pagination.pageSize,
      });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      updatePagination({
        page: pagination.page + 1,
        pageSize: pagination.pageSize,
      });
    }
  };

  return (
    <div>
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-secondary'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className='font-bold py-4'>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className='hover:cursor-pointer hover:bg-muted'
                  onClick={() => handleOnRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-4 font-medium'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* <div className='flex items-center justify-end space-x-2 py-4'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div> */}
      {/* Pagination Controls */}
      {pagination && (
        <div className='flex items-center justify-between px-2 py-4'>
          <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
            {pagination.page * pagination.pageSize + 1}-
            {Math.min(
              (pagination.page + 1) * pagination.pageSize,
              pagination.totalCount
            )}{" "}
            {"of"} {pagination.totalCount}
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='min-h-[44px] px-4'
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              {"previous"}
            </Button>
            <Button
              variant='outline'
              className='min-h-[44px] px-4'
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
            >
              {"next"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
