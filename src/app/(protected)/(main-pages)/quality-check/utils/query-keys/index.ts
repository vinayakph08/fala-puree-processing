export const QC_KEYS = {
  all: ["quality-check"],
  byUser: (userId: string) => ["quality-check", userId],
  detail: (id: string) => ["quality-check", "detail", id],
};
