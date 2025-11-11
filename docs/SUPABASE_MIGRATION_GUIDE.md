# 🚜 Supabase CLI Migration Commands Guide

Based on your Fala app setup, here's a comprehensive guide to Supabase migration commands for both local and remote environments.

---

## 📋 **Local Development Migration Commands**

### **1. Creating New Migrations**

```bash
# Create a new migration file
supabase migration new <migration_name>

# Example for your farmer app
supabase migration new add_farmer_inventory_table
supabase migration new update_user_profile_constraints
supabase migration new add_crop_categories
```

**When to use:**

- Adding new tables (farmer_inventory, crop_categories)
- Modifying existing schema (user_profile changes)
- Adding new features to your farmer app

**What it does:**

- Creates a new SQL file in `supabase/migrations`
- Generates timestamp-based filename: `20250814123456_add_farmer_inventory_table.sql`
- You write your SQL schema changes in this file

---

### **2. Applying Migrations Locally**

```bash
# Apply all pending migrations to local database
supabase migration up

# Apply specific migration
supabase migration up --target 20250814123456

# Apply with verbose output (see what's happening)
supabase migration up --debug
```

**When to use:**

- After creating new migration files
- When pulling changes from team members
- Testing your schema changes locally

**What it does:**

- Runs SQL migrations against your local PostgreSQL (127.0.0.1:54322)
- Updates your local database schema
- Records applied migrations in `supabase_migrations.schema_migrations` table

---

### **3. Database Reset & Rebuild**

```bash
# Reset local database and reapply all migrations
supabase db reset

# Reset and seed with sample data
supabase db reset --seed

# Reset with debug information
supabase db reset --debug
```

**When to use:**

- When your local database gets corrupted
- Testing migration sequence from scratch
- Cleaning up development data
- Before major schema changes

**What it does:**

- Drops all tables and data
- Recreates database from scratch
- Applies all migrations in order
- Runs seed scripts if present

---

### **4. Checking Migration Status**

```bash
# Show migration status
supabase migration list

# Show detailed migration history
supabase migration list --verbose

# Check if migrations are applied
supabase migration up --dry-run
```

**When to use:**

- Checking which migrations are applied
- Debugging migration issues
- Before applying new migrations

**Example output:**

```
Applied migrations:
  20250812142021_user_profile.sql
  20250814123456_add_farmer_inventory_table.sql

Pending migrations:
  20250814134567_add_crop_categories.sql
```

---

## ☁️ **Remote/Production Migration Commands**

### **1. Linking to Remote Project**

```bash
# Link your local project to remote Supabase project
supabase link --project-ref your-fala-project-id

# Check current link status
supabase status

# Switch between projects
supabase link --project-ref another-project-id
```

**When to use:**

- First time deploying to production
- Switching between staging/production environments
- Team collaboration setup

---

### **2. Pushing Schema to Remote**

```bash
# Push local schema changes to remote database
supabase db push

# Push with confirmation prompts
supabase db push --confirm

# Push specific migration
supabase db push --include-seed
```

**When to use:**

- Deploying your farmer app to production
- Updating production database schema
- After testing migrations locally

**What it does:**

- Compares local schema with remote
- Applies differences to remote database
- **⚠️ Can be destructive** - always backup first

---

### **3. Pulling Schema from Remote**

```bash
# Pull remote schema to local
supabase db pull

# Pull and generate new migration file
supabase db pull --schema public

# Pull specific schemas
supabase db pull --schema public,auth
```

**When to use:**

- Syncing with team members' changes
- Getting production schema locally
- After someone else deployed changes

**What it does:**

- Downloads remote database schema
- Creates new migration file with differences
- Updates your local schema definition

---

## 🔄 **Practical Workflow Examples for Fala App**

### **Scenario 1: Adding Farmer Inventory Feature**

```bash
# 1. Create migration for new farmer inventory table
supabase migration new add_farmer_inventory_table

# 2. Edit the generated migration file
# Add your SQL in: supabase/migrations/TIMESTAMP_add_farmer_inventory_table.sql
```

```sql
CREATE TABLE farmer_inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID REFERENCES user_profile(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  crop_name_kn TEXT NOT NULL, -- Kannada name
  quantity_kg DECIMAL(10,2) NOT NULL,
  harvest_date DATE NOT NULL,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C')),
  price_per_kg DECIMAL(10,2),
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE farmer_inventory ENABLE ROW LEVEL SECURITY;

-- Policy for farmers to manage their own inventory
CREATE POLICY "Farmers can manage own inventory" ON farmer_inventory
  FOR ALL USING (
    farmer_id = auth.uid() OR
    EXISTS (SELECT 1 FROM user_profile WHERE id = auth.uid() AND role = 'ADMIN')
  );
```

```bash
# 3. Apply migration locally
supabase migration up

# 4. Test with your Next.js app
npm run dev

# 5. When ready for production
supabase db push
```

---

### **Scenario 2: Team Collaboration**

```bash
# Pull latest changes from team
git pull origin main

# Check if there are new migrations
supabase migration list

# Apply any new migrations
supabase migration up

# If conflicts, reset and reapply
supabase db reset
```

---

### **Scenario 3: Production Deployment**

```bash
# 1. Test all migrations locally first
supabase db reset
supabase migration up

# 2. Push to production
supabase link --project-ref your-production-project
supabase db push --confirm

# 3. Verify remote status
supabase migration list --remote
```

---

## 🛠 **Advanced Migration Commands**

### **Schema Diffing & Generation**

```bash
# Generate migration from schema differences
supabase db diff --use-migra

# Generate diff between local and remote
supabase db diff --remote

# Generate diff with specific schema
supabase db diff --schema public,auth

# Create migration from SQL file
supabase migration new --sql path/to/schema.sql

# Generate TypeScript types from schema
supabase gen types typescript --local > lib/database.types.ts

# Generate types for specific schema
supabase gen types typescript --schema public --local > lib/public-types.ts

# Generate Go types
supabase gen types go --local > types/database.go

# Generate C# types
supabase gen types csharp --local > Database.cs
```

### **Database Introspection & Analysis**

```bash
# Inspect database structure
supabase db inspect

# Show detailed table information
supabase db inspect --table user_profile

# Analyze database performance
supabase db analyze

# Show database statistics
supabase db stats

# Check database size and usage
supabase db usage

# Show slow queries (requires query logging)
supabase db slow-queries --limit 10

# Explain query plans
supabase db explain "SELECT * FROM user_profile WHERE role = 'FARMER'"
```

### **Backup & Restore Operations**

```bash
# Dump local database (structure + data)
supabase db dump --local > backup.sql

# Dump only schema (no data)
supabase db dump --local --schema-only > schema-backup.sql

# Dump only data (no schema)
supabase db dump --local --data-only > data-backup.sql

# Dump specific tables
supabase db dump --local --table user_profile,farmer_inventory > partial-backup.sql

# Dump with custom format (for large databases)
supabase db dump --local --format custom > backup.dump

# Restore from backup
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres < backup.sql

# Restore specific table
psql -h 127.0.0.1 -p 54322 -U postgres -d postgres -c "\\copy user_profile FROM 'user_profile.csv' CSV HEADER"

# Dump remote database
supabase db dump --remote > production-backup.sql

# Stream large database dump
supabase db dump --remote | gzip > production-backup.sql.gz
```

### **Migration Validation & Testing**

```bash
# Validate migration syntax without applying
supabase migration validate

# Test migration rollback capability
supabase migration test-rollback --target 20250814123456

# Check migration dependencies
supabase migration dependencies

# Simulate migration on copy of production data
supabase db branch create test-migration
supabase migration up --branch test-migration

# Compare schemas between environments
supabase db compare --source local --target remote

# Check for breaking changes
supabase db breaking-changes --source local --target remote
```

### **Performance & Monitoring**

```bash
# Monitor migration progress
supabase migration up --progress

# Show migration execution time
supabase migration up --timing

# Profile database performance
supabase db profile --duration 30s

# Monitor active connections
supabase db connections

# Show current locks
supabase db locks

# Monitor query performance
supabase db query-stats

# Set up migration alerts
supabase db alerts setup --email your-email@domain.com
```

### **Advanced Schema Operations**

```bash
# Create schema from existing database
supabase db reverse-engineer --output schema.sql

# Merge multiple migration files
supabase migration merge --from 20250814123456 --to 20250814789012

# Split large migration into smaller ones
supabase migration split 20250814123456 --chunks 3

# Create reproducible schema snapshot
supabase db snapshot create --name "pre-v2-release"

# Restore from snapshot
supabase db snapshot restore --name "pre-v2-release"

# Compare snapshots
supabase db snapshot diff --from snapshot1 --to snapshot2
```

### **Data Migration & Seeding**

```bash
# Run custom seed scripts
supabase db seed --file seeds/farmer-test-data.sql

# Seed with environment-specific data
supabase db seed --env development

# Import CSV data
supabase db import --table user_profile --file farmers.csv

# Export table data to CSV
supabase db export --table farmer_inventory --format csv > inventory.csv

# Sync data between environments
supabase db sync --from production --to staging --table user_profile

# Anonymize sensitive data for development
supabase db anonymize --config anonymize-config.yml
```

### **Migration Rollback & Recovery**

```bash
# Rollback to specific migration
supabase migration down --target 20250814123456

# Create rollback migration
supabase migration rollback 20250814789012

# Safe rollback with backup
supabase db backup && supabase migration down --target 20250814123456

# Emergency rollback (removes migration from history)
supabase migration remove 20250814789012 --force

# Recover from failed migration
supabase migration repair 20250814789012

# Mark migration as applied without running
supabase migration mark-applied 20250814123456
```

### **Multi-Environment Management**

```bash
# Create environment-specific configs
supabase migration create-config --env staging
supabase migration create-config --env production

# Deploy to specific environment
supabase migration deploy --env staging

# Compare environments
supabase env compare --source staging --target production

# Promote from staging to production
supabase env promote --from staging --to production

# Environment-specific rollback
supabase migration down --env production --target 20250814123456
```

---

## 🚨 **Best Practices for Fala App**

### **1. Migration Naming Convention**

```bash
# ✅ Good naming
supabase migration new add_farmer_inventory_table
supabase migration new update_user_profile_add_location_constraint
supabase migration new create_crop_categories_seed_data

# ❌ Bad naming
supabase migration new fix
supabase migration new update
supabase migration new temp
```

### **2. Safe Migration Patterns**

```sql
-- ✅ Safe: Add column with default
ALTER TABLE user_profile ADD COLUMN farm_size_acres DECIMAL(10,2) DEFAULT 0;

-- ✅ Safe: Create new table
CREATE TABLE IF NOT EXISTS crop_categories (...);

-- ⚠️ Risky: Drop column (consider deprecation first)
-- ALTER TABLE user_profile DROP COLUMN old_column;

-- ✅ Better: Mark as deprecated first
ALTER TABLE user_profile ADD COLUMN old_column_deprecated BOOLEAN DEFAULT TRUE;
```

### **3. Testing Workflow**

```bash
# Always test migration sequence
supabase db reset
supabase migration up
npm run dev  # Test your farmer app

# Test with seed data
supabase db reset --seed
```

---

## 🔧 **Troubleshooting Common Issues**

### **Migration Fails**

```bash
# Check migration syntax
supabase migration validate

# Check dependencies
supabase migration dependencies

# Manual rollback and retry
supabase migration down --target previous_working_migration
supabase migration up
```

### **Schema Drift**

```bash
# Detect schema differences
supabase db diff --remote

# Reset local to match remote
supabase db pull
supabase db reset
```

### **Production Issues**

```bash
# Check production status
supabase migration list --remote

# Safe production rollback
supabase db backup --remote
supabase migration down --remote --target safe_migration
```

---

## 📚 **Additional Resources**

- [Supabase Migration Documentation](https://supabase.com/docs/guides/database/migrations)
- [PostgreSQL Migration Best Practices](https://www.postgresql.org/docs/current/ddl-alter.html)
- [Fala App Database Schema](./DATABASE_SCHEMA.md)

---

_This guide is specifically tailored for the Fala farmer app development workflow. Keep it updated as new Supabase CLI features are released._

## ** Terminal Setup **

For complete terminal setup including aliases and auto-completion, see the dedicated guide:

📖 **[Supabase Terminal Setup Guide](./SUPABASE_TERMINAL_SETUP.md)**

### **Quick Setup**

```bash
# Add alias
echo 'alias sp="supabase"' >> ~/.zshrc

# Add auto-completion
supabase completion zsh > ~/.supabase-completion.zsh
echo 'source ~/.supabase-completion.zsh' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```
