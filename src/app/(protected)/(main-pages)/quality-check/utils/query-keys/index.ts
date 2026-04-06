export const QC_KEYS = {
  all: ["quality-check"] as const,
  search: (params: Record<string, unknown>) => ["quality-check", "search", params] as const,
  detail: (id: string) => ["quality-check", "detail", id] as const,
};
