---
name: generate-skills-for-codebase
description: "Use when setting up GitHub Copilot agent customization for a new or existing codebase that lacks .github/instructions/, .github/skills/, or copilot-instructions.md. Analyzes codebase architecture and generates the full set of context files tailored to the project. Invoke when user says: set up copilot for this project, create skills for this codebase, generate instructions, bootstrap copilot context."
argument-hint: "Path to the target codebase root, e.g. /path/to/admin-app"
---

# Generate Skills for Codebase

## When to Use

Invoke when bootstrapping Copilot agent customization for a codebase that doesn't yet have a structured `.github/` setup. Works on any framework — Next.js, Express, NestJS, plain React, etc.

## Reference Model

The fala-app (the repository where this skill lives) is the reference example of a complete Copilot setup. Before generating anything, read these files to understand the target quality and structure:

| File | Purpose |
|---|---|
| `.github/copilot-instructions.md` | Always-loaded mental model — architecture + hard rules, no code blocks |
| `.github/instructions/*.instructions.md` | Auto-loaded per `applyTo` glob — layer-specific rules + minimal code snippets |
| `.github/skills/new-feature/SKILL.md` | On-demand skill — multi-step workflow with assets and references |
| `.github/skills/new-feature/assets/` | Code templates used by the skill |
| `.github/skills/new-feature/references/` | Layer reference docs with rules + code |
| `.github/prompts/*.prompt.md` | Single-shot prompts for specific tasks |

---

## Phase 1 — Explore the Target Codebase

Answer every question below before writing a single file. Use file reads, grep, and directory listings. Do not guess.

### 1.1 Project Identity
- What does the app do? Who uses it? (README, package.json description)
- What is the business domain and key terminology?
- Is there an existing `copilot-instructions.md`, `AGENTS.md`, or `CLAUDE.md`? Read it.

### 1.2 Tech Stack
Read `package.json` dependencies. Identify:
- Framework and version (Next.js 15? Express? NestJS? Remix?)
- Language (TypeScript? JS?)
- UI library (Shadcn, MUI, Tailwind, etc.)
- DB / ORM (Supabase, Prisma, Drizzle, raw SQL, etc.)
- State / data fetching (React Query, SWR, Redux, Zustand, etc.)
- Form library (react-hook-form, Formik, controlled?)
- Validation (Zod, Yup, etc.)
- Auth (Supabase Auth, NextAuth, Clerk, JWT, session?)
- i18n (next-intl, i18next, none?)

### 1.3 Directory Structure
- How are features organized? (feature folders? flat by type? monorepo packages?)
- Where is the app entry point?
- Where are shared components, hooks, utilities, types?
- Where do tests live? What test framework?
- What is inside `src/` vs root?

### 1.4 Data / DB Layer
Find DB access files. Answer:
- What pattern is used? (class-based controller, repository, service, direct ORM calls?)
- What does a DB operation return? (throws on error? returns `{data, error}`? returns raw ORM result?)
- Is there Row Level Security or authorization enforced at DB level?
- Is the DB client created per-request or as a singleton?
- Sample: read 1-2 actual DB access files to confirm the pattern

### 1.5 API / Backend Layer
Find API route files. Answer:
- How are routes structured? (Next.js App Router `/api/route.ts`? Express router? tRPC?)
- What is the HTTP response shape convention? (`{data}`, `{success, data}`, raw object?)
- How is auth checked? (middleware, inline check, decorator?)
- Is there a consistent error handling pattern? (try/catch, error middleware?)
- Sample: read 1-2 actual route files

### 1.6 Data Fetching on the Client
Find hooks or query files. Answer:
- Where do React Query / SWR hooks live? (global `hooks/`? per-feature `hooks/`?)
- Where do query functions (fetch calls) live? Inline in hooks? Separate files?
- Is there a naming convention for query vs mutation functions? (`api*`, `fetch*`, `get*`?)
- Is there a server-side prefetch pattern? (HydrationBoundary, getServerSideProps, loader?)
- How are query keys structured? (inline arrays? constants? hierarchical objects?)

### 1.7 Forms
Find form components. Answer:
- How are forms built? (React Hook Form + Shadcn? Controlled state? Formik?)
- How do forms submit? (Server Action? API mutation hook? Direct fetch?)
- How are edit forms populated with existing data? (`defaultValues`? `useEffect` + `reset`?)
- How are dialog/modal forms reset on close?

### 1.8 Components
Find a few representative components. Answer:
- Named exports or default exports?
- How are async states (loading / error / empty) handled?
- How is `useTranslations` or equivalent used?
- What is the minimum touch target convention?
- How are Shadcn components extended? (one-off `className`? `cva` variants?)

### 1.9 Server Actions (if Next.js)
Find server action files. Answer:
- Pattern: `"use server"` + Zod validation + DB controller call + `revalidatePath`?
- Return shape: `{data, error}`? `{success, error}`?
- Is there a consistent auth check at the top?

### 1.10 Auth Pattern
- How is the current user retrieved server-side? (utility function? direct Supabase call?)
- How are protected routes handled? (middleware? layout check? component guard?)
- What client is used in server vs browser contexts?

### 1.11 Naming Conventions
Read file and folder names across the codebase. Document:
- File names: `kebab-case`? `camelCase`? `PascalCase`?
- Component names: PascalCase?
- Function prefixes for specific patterns?
- Constants: `UPPER_SNAKE_CASE`?
- Any observed `api*`, `db*`, `use*`, `get*` prefix conventions?

### 1.12 i18n (if present)
- What library? What is the default locale?
- Where do translation files live? What format (JSON, YAML)?
- How is the translation hook called? (`useTranslations("namespace")`?)
- Are Zod error messages translated?

---

## Phase 2 — Identify Key Workflows

For each workflow, document the **exact files** a developer creates and the **exact order**:

- **New Feature** — enumerate every file created, every import added, every translation key block
- **New DB Migration / Schema Change** — if applicable
- **New API Route** (standalone, not part of a feature) — if applicable
- **Any other notable repeatable workflows** specific to this app (e.g. new agent, new email template)

These workflows drive what skills to create in Phase 3.

---

## Phase 3 — Generate Files

Generate in this exact order. Do not write files until Phase 1 and 2 are fully answered.

### 3.1 `copilot-instructions.md` — Always-Loaded Mental Model

Location: `.github/copilot-instructions.md` in the target codebase root.

Rules:
- Mental model only — no code blocks that duplicate instruction files
- Architecture diagram (text-ASCII, like the 4-layer diagram in fala-app)
- Key decision table ("when to use X vs Y")
- Security-critical rules (auth client selection, RLS, service role key scope)
- Data shape transformation chain (if there is a multi-layer data flow)
- Feature directory structure (exact folder layout)
- Naming conventions (including any function prefixes)
- i18n rules (if applicable)
- Domain context (terminology, business flow)
- Common mistakes ❌ / ✅
- Code response rules

### 3.2 Instruction Files — Auto-Loaded Per Layer

Location: `.github/instructions/` in the target codebase.

Create one file per distinct layer with its own rules. Typical set (adjust to what the codebase actually has):

| Instruction File | `applyTo` Glob | Contents |
|---|---|---|
| `db-controller.instructions.md` | `**/db-controller/**` | Return shape, client creation, error handling, singleton export |
| `api-routes.instructions.md` | `src/app/api/**` | Auth-first rule, UNWRAP/WRAP, HTTP status codes, logging |
| `components.instructions.md` | `**/*.tsx` | Exports, `"use client"`, async states, touch targets, i18n, Shadcn |
| `hooks.instructions.md` | `**/hooks/**` or `**/use-*.ts` | Query keys, staleTime, mutateAsync, import from query-functions |
| `server-actions.instructions.md` | `**/server-actions/**` | `"use server"`, auth, Zod, revalidatePath, return shape |

Each instruction file format:
```
---
applyTo: [glob]
---
# [Layer Name] Rules
[Rule bullets + minimal code snippet per rule]
```

### 3.3 Skills — On-Demand Workflow Guides

Location: `.github/skills/` in the target codebase.

**Always create:**
- `new-feature/SKILL.md` — end-to-end feature build matching the workflow identified in Phase 2
  - `assets/` — one template per file type in the workflow (types, db-controller, api-route, hook, server-action, component, translations, form, table if applicable)
  - `references/` — one reference per layer (rules + code, more detailed than instruction files)

**Create if applicable:**
- `new-migration/SKILL.md` — if the codebase has DB migrations
- Other skills for any complex repeatable workflows from Phase 2

### 3.4 Prompts — Optional Single-Shot Tasks

Location: `.github/prompts/` in the target codebase.

Only create if there are clear use cases for structured single-shot invocations. Examples:
- `get-stitch-design.prompt.md` — fetch and translate a UI design to component spec
- `review-pr.prompt.md` — structured code review checklist
- `generate-migration.prompt.md` — produce a DB migration from a schema description

---

## Deliverables Checklist

- [ ] Phase 1 fully answered — no guesses, all patterns confirmed by reading actual files
- [ ] Phase 2 workflows documented with exact file lists and order
- [ ] `copilot-instructions.md` — mental model only, no code duplication of instruction files
- [ ] One instruction file per distinct layer, each with correct `applyTo` glob
- [ ] `new-feature` skill with `SKILL.md` + `assets/` templates + `references/` layer docs
- [ ] All templates use `// @ts-nocheck` and `[feature]` placeholders
- [ ] Form template covers both create (Dialog) and edit (`useEffect` + `form.reset`) patterns
- [ ] Table template/reference created if the codebase displays tabular data with sort/filter
- [ ] Skills created for every other complex workflow identified in Phase 2
- [ ] Translation key structure documented in templates (if i18n is used)
- [ ] Prompts created for any valid single-shot workflow needs
- [ ] All generated files cross-reference each other (skill references its assets and references; instruction files mentioned in `copilot-instructions.md`)
