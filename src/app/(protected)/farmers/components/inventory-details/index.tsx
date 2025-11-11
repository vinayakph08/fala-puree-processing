"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { addInventoryType, InventoryItem } from "../../types";
import { AddInventoryButton } from "../add-inventory-button";
import { EditInventoryButton } from "../edit-inventory-button";

interface InventoryDetailsProps {
  farmerId: string;
  data: InventoryItem[];
  onEdit?: (item: InventoryItem) => void;
  onDelete?: (id: string) => void;
  onAdd?: (item: addInventoryType) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Sowed":
      return "bg-blue-100 text-blue-800";
    case "Growing":
      return "bg-yellow-100 text-yellow-800";
    case "Ready to Harvest":
      return "bg-orange-100 text-orange-800";
    case "Harvested":
      return "bg-green-100 text-green-800";
    case "Sold":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const InventoryDetails = ({
  farmerId,
  data,
  onDelete,
}: InventoryDetailsProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "crop",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='h-8 text-left'
          >
            Crop
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className='font-medium'>{getValue() as string}</div>
      ),
    },
    {
      accessorKey: "guntas",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='h-8 px-2 lg:px-3'
          >
            Guntas
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className='text-center'>{getValue() as number}</div>
      ),
    },
    {
      accessorKey: "availableInventory",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='h-8 px-2 lg:px-3'
          >
            Available Inventory (kg)
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => (
        <div className='text-center font-mono'>{getValue() as number} kg</div>
      ),
    },
    {
      accessorKey: "sowedDate",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='h-8 px-2 lg:px-3'
          >
            Sowed Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return <div className='text-center'>{date}</div>;
      },
    },
    {
      accessorKey: "harvestDate",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className='h-8 px-2 lg:px-3'
          >
            Harvest Date
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className='ml-2 h-4 w-4' />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className='ml-2 h-4 w-4' />
            ) : (
              <ArrowUpDown className='ml-2 h-4 w-4' />
            )}
          </Button>
        );
      },
      cell: ({ getValue }) => {
        const date = getValue() as string;
        return <div className='text-center'>{date}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className='flex items-center gap-2'>
            <EditInventoryButton farmerId={farmerId} editItem={item} />
            {onDelete && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  setItemToDelete(item.id);
                  setDeleteDialogOpen(true);
                }}
                className='h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <>
      <Card className='w-full'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-xl font-semibold'>
              Inventory Details
            </CardTitle>
            <div className='flex items-center space-x-2'>
              <AddInventoryButton farmerId={farmerId} />
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Search crops...'
                  value={globalFilter ?? ""}
                  onChange={(event) =>
                    setGlobalFilter(String(event.target.value))
                  }
                  className='pl-8 w-[200px] lg:w-[250px]'
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} className='px-2 lg:px-4'>
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
                      className='hover:bg-muted/50'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className='px-2 lg:px-4'>
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
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='text-sm text-muted-foreground'>
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}{" "}
              of {table.getFilteredRowModel().rows.length} entries
            </div>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </Button>
              <div className='flex items-center space-x-1'>
                <span className='text-sm font-medium'>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </span>
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Delete Crop</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this crop? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='flex-col sm:flex-row gap-2'>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              className='w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                if (itemToDelete && onDelete) {
                  onDelete(itemToDelete);
                }
                setDeleteDialogOpen(false);
                setItemToDelete(null);
              }}
              className='w-full sm:w-auto'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
