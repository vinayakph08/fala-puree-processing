---
description: "Use when creating or editing migration files under supabase/migrations/. Enforces the post-generation checklist, naming rules, dev commands, and domain-specific gotchas for the Fala Processing database."
applyTo: "supabase/migrations/**"
---

# Migration Rules

## Generating a Migration

Always invoke the `/create-migration` skill for any new migration — it runs a pre-generation interview, picks the correct SQL template, and walks through the full checklist.

Full rule reference and SQL templates: [skills/create-migration/references/patterns.md](../skills/create-migration/references/patterns.md)

---

## Dev Commands

```bash
npm run db:start       # Start local Supabase (port 54321 API, 54322 DB)
npm run reset       # Reset with fresh migrations + seed data
npm run migration   # Generate a new timestamped migration filename
npm run up          # Apply pending migrations locally
npm run push        # Apply migrations to remote
```

---

## Post-Generation Checklist

Apply before finalising every migration file:

- [ ] File named `YYYYMMDDHHMMSS_descriptive_name.sql` — timestamp matches current date/time
- [ ] Header comment block present: migration title, created date, purpose
- [ ] `DROP FUNCTION IF EXISTS public.{name}(...)` present if the function's parameter signature changed — `CREATE OR REPLACE` only works for identical signatures
- [ ] All `CREATE TABLE` and `CREATE INDEX` use `IF NOT EXISTS`
- [ ] All table and function references use `public.` prefix — no bare unqualified names
- [ ] All functions use `LANGUAGE plpgsql SECURITY DEFINER` — never `LANGUAGE sql`
- [ ] Every `SELECT` includes `WHERE is_deleted = FALSE` — never rely on RLS for this
- [ ] FARMER role always overrides `p_farmer_id` to `auth.uid()` — never trusts the passed value
- [ ] Return envelope is `{data, error}` only — no `success` field anywhere
- [ ] `EXCEPTION WHEN OTHERS` returns the fixed string `'An unexpected error occurred'` — never `SQLERRM`
- [ ] `GRANT EXECUTE ON FUNCTION public.{name}(...) TO authenticated` block at the end
- [ ] `COMMENT ON FUNCTION public.{name}(...)` present

---