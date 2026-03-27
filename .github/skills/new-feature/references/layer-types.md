# Types Layer

Domain types are defined manually during the MVP phase. Do not auto-generate from Supabase schema.

## Location

`src/types/[feature].ts`

## Convention

- Use `I` prefix for entity interfaces: `IFeatureItem`
- Define Insert and Update types from the base interface
- No `any` types

## Template

```typescript
export interface IFeatureItem {
  id: string;
  farmer_id: string;
  // --- domain fields ---
  name: string;
  status: FeatureStatus;
  notes?: string | null;
  // --- audit fields ---
  is_deleted: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export type FeatureStatus = "active" | "completed" | "cancelled";

export type FeatureInsert = Omit<IFeatureItem, "id" | "created_at" | "updated_at" | "is_deleted" | "deleted_at">;

export type FeatureUpdate = Partial<FeatureInsert>;
```

## Export from `src/types/index.ts`

Add the new types to the barrel export:

```typescript
export * from "./feature";
```
