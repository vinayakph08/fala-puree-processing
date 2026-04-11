"use client";

import { useState, useMemo, useEffect } from "react";
import debounce from "lodash/debounce";
import {
  Plus,
  Search,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQualityCheck } from "../../hooks/use-quality-check";
import { useProfile } from "@/hooks/use-profile";
import type { QualityTestListItem, QualityTestStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Passed", value: "passed" },
  { label: "Failed", value: "failed" },
];

function StatusBadge({ status }: { status: QualityTestStatus }) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        status === "passed" &&
          "bg-emerald-50 text-emerald-600 border-emerald-100",
        status === "pending" && "bg-amber-50 text-amber-600 border-amber-100",
        status === "failed" && "bg-red-50 text-red-600 border-red-100",
        status === "draft" && "bg-gray-50 text-gray-500 border-gray-200",
      )}
    >
      {status}
    </span>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-[64px] w-full rounded-2xl" />
      ))}
    </div>
  );
}

function BatchCard({
  test,
  isAdmin,
  onDelete,
  isDeleting,
}: {
  test: QualityTestListItem;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  const router = useRouter();
  const date = new Date(test.test_date);
  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex items-center justify-between hover:shadow-md hover:border-primary/20 transition-all min-h-[64px] pr-2">
      <button
        className="flex-1 flex items-center justify-between p-4 min-h-[64px] text-left"
        onClick={() => router.push(`/quality-check/${test.id}`)}
      >
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-semibold text-primary">
            #{test.batch_id}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {formatted} • {time}
          </span>
        </div>
        <div className="flex flex-col items-end space-y-2 mr-2">
          <StatusBadge status={test.status} />
        </div>
      </button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="h-10 w-10 flex items-center justify-center rounded-xl hover:bg-gray-100 flex-shrink-0"
            aria-label="Actions"
          >
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/quality-check/${test.id}`)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              disabled={isDeleting}
              onClick={() => onDelete(test.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function QualityCheckDashboard() {
  const router = useRouter();
  const { profile } = useProfile();
  const isAdmin = profile?.role === "ADMIN";

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const {
    tests,
    pagination,
    isLoading,
    error,
    searchParams,
    setSearchParams,
    deleteTest,
    isDeleting,
  } = useQualityCheck();

  const debouncedSearch = useMemo(
    () =>
      debounce(
        (value: string) =>
          setSearchParams((p) => ({ ...p, search: value, page: 0 })),
        350,
      ),
    [setSearchParams],
  );

  useEffect(() => () => debouncedSearch.cancel(), [debouncedSearch]);

  function handleSearch(value: string) {
    debouncedSearch(value);
  }

  function handleStatusFilter(status: string | undefined) {
    setSearchParams((p) => ({ ...p, status, page: 0 }));
  }

  async function handleDelete(id: string) {
    setConfirmDeleteId(null);
    await deleteTest(id);
  }

  return (
    <div className="flex flex-col h-full gap-4 pt-4">
      {/* Header */}
      <header className="flex flex-col space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Puree Quality
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor batch traceability and standards.
        </p>
      </header>

      {/* Primary CTA */}
      <button
        onClick={() => router.push("/quality-check/new")}
        className="w-full bg-primary hover:bg-primary/90 text-white transition-colors py-4 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-sm min-h-[56px]"
      >
        <Plus className="h-5 w-5" />
        <span className="font-semibold tracking-wide">New Quality Test</span>
      </button>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by batch ID..."
          className="pl-9 min-h-[44px] rounded-xl"
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            onClick={() => handleStatusFilter(f.value)}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors min-h-[36px]",
              searchParams.status === f.value
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary/40",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <section className="flex flex-col flex-1 min-h-0 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Tests
          </h2>
          {pagination && (
            <span className="text-xs text-muted-foreground">
              {pagination.total_count} total
            </span>
          )}
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load tests.</p>
        ) : !tests.length ? (
          <p className="text-sm text-muted-foreground">No tests found.</p>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
            {tests.map((test) => (
              <BatchCard
                key={test.id}
                test={test}
                isAdmin={isAdmin}
                onDelete={(id) => setConfirmDeleteId(id)}
                isDeleting={isDeleting}
              />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] min-w-[44px]"
            disabled={!pagination.has_previous_page}
            onClick={() =>
              setSearchParams((p) => ({ ...p, page: (p.page ?? 0) - 1 }))
            }
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {(searchParams.page ?? 0) + 1} / {pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] min-w-[44px]"
            disabled={!pagination.has_next_page}
            onClick={() =>
              setSearchParams((p) => ({ ...p, page: (p.page ?? 0) + 1 }))
            }
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Delete confirm dialog */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quality Test?</DialogTitle>
            <DialogDescription>
              This test will be permanently removed. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              className="flex-1 min-h-[44px]"
              onClick={() => setConfirmDeleteId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 min-h-[44px]"
              disabled={isDeleting}
              onClick={() => confirmDeleteId && handleDelete(confirmDeleteId)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
