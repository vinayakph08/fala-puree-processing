"use client";

import { Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQualityCheck } from "../../hooks/use-quality-check";
import type { QualityTest, QualityTestStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: QualityTestStatus }) {
  return (
    <span
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        status === "passed" &&
          "bg-emerald-50 text-emerald-600 border-emerald-100",
        status === "pending" &&
          "bg-amber-50 text-amber-600 border-amber-100",
        status === "failed" &&
          "bg-red-50 text-red-600 border-red-100",
        status === "draft" &&
          "bg-gray-50 text-gray-500 border-gray-200",
      )}
    >
      {status}
    </span>
  );
}

function BatchCard({ test }: { test: QualityTest }) {
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
    <Link
      href={`/quality-check/${test.id}`}
      className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center justify-between hover:shadow-md hover:border-primary/20 transition-all min-h-[64px]"
    >
      <div className="flex flex-col space-y-1">
        <span className="text-sm font-semibold text-primary">
          #{test.batch_id}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {formatted} • {time}
        </span>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <StatusBadge status={test.status} />
        <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
      </div>
    </Link>
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

export function QualityCheckDashboard() {
  const router = useRouter();
  const { tests, isLoading, error } = useQualityCheck();

  return (
    <div className="space-y-8 pt-4">
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

      {/* Recent Tests */}
      <section className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Recent Tests
          </h2>
        </div>

        {isLoading ? (
          <DashboardSkeleton />
        ) : error ? (
          <p className="text-sm text-destructive">Failed to load tests.</p>
        ) : !tests?.length ? (
          <p className="text-sm text-muted-foreground">No tests recorded yet.</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <BatchCard key={test.id} test={test} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
