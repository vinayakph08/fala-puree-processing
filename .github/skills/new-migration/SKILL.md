---
name: new-migration
description: "Use when creating a new database migration, adding a table, altering schema, or writing RLS policies. Invoke when user says create migration, add table, alter schema, add column, write RLS."
argument-hint: "What to migrate (e.g. create tasks table, add status column to orders)"
---

# New Migration

## When to Use

Any Supabase schema change: new table, column addition, index, RLS policy, or RPC function.

## Step 1 — Create the Migration File

Run the project command to scaffold a new migration file:

```bash
npm run new-migration
```

This creates a timestamped file in `supabase/migrations/`. Edit that file.

## Step 2 — Write the Migration

Use the [migration template](./assets/migration.template.sql).

Follow this order inside the SQL file:
1. `CREATE TABLE` with all columns
2. `CREATE INDEX` statements
3. `updated_at` trigger
4. `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
5. `CREATE POLICY` for SELECT, INSERT, UPDATE, DELETE

## Step 3 — RLS Policies — Non-Negotiable

Every table **must** have RLS enabled and policies for all four operations.
Use the pattern: `farmer_id = auth.uid()` for row ownership.

```sql
ALTER TABLE public.[feature] ENABLE ROW LEVEL SECURITY;

CREATE POLICY "[feature]: user select own"
ON public.[feature] FOR SELECT
USING (farmer_id = auth.uid());

CREATE POLICY "[feature]: user insert own"
ON public.[feature] FOR INSERT
WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "[feature]: user update own"
ON public.[feature] FOR UPDATE
USING (farmer_id = auth.uid())
WITH CHECK (farmer_id = auth.uid());

CREATE POLICY "[feature]: user delete own"
ON public.[feature] FOR DELETE
USING (farmer_id = auth.uid());
```

## Step 4 — Apply Locally

```bash
npm run db:reset
```

This resets the local Supabase DB and re-runs all migrations.

## Step 5 — Verify

Check that:
- [ ] All columns have correct types and constraints
- [ ] `farmer_id` references `auth.users(id) ON DELETE CASCADE`
- [ ] RLS is enabled on the table
- [ ] All 4 RLS policies are defined (SELECT, INSERT, UPDATE, DELETE)
- [ ] Indexes exist on `farmer_id` and any frequently queried columns
- [ ] `updated_at` trigger is attached if the table has an `updated_at` column

## Soft Delete Convention

If the table needs soft delete support, add these columns:

```sql
is_deleted BOOLEAN NOT NULL DEFAULT false,
deleted_at TIMESTAMPTZ,
```

And add a corresponding RPC function in a separate migration:

```sql
CREATE OR REPLACE FUNCTION soft_delete_[feature](p_[feature]_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.[feature]
  SET is_deleted = true, deleted_at = now()
  WHERE id = p_[feature]_id AND farmer_id = auth.uid();
END;
$$;
```

## Full Template

See [migration.template.sql](./assets/migration.template.sql)
