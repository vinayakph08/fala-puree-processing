// @ts-nocheck
// src/app/(protected)/(main-pages)/[feature]/db-controller/index.ts
// Replace [feature], [Feature], and table/rpc names with your feature

// ─── When to use RPC vs Direct Query ─────────────────────────────────────────
//
// Use DIRECT QUERY (.from().select/insert/update) when:
//   - Simple single-table CRUD
//   - Filtering/ordering rows for a single table
//   - No side effects or cascading logic needed
//
// Use RPC (supabase.rpc("fn_name", { p_param })) when:
//   - Soft delete / restore (multi-field update with business logic)
//   - Multi-table writes that must be atomic
//   - Reward/points calculation triggered by a DB event
//   - Any logic that must run inside a DB transaction
//
// RPC naming convention: verb_noun — e.g. soft_delete_inventory, add_inventory_reward
// RPC param naming convention: p_ prefix — e.g. p_inventory_id, p_farmer_id
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@/utils/supabase/server";
import type { DbResult } from "@/types";
import { FeatureInsert, FeatureUpdate, IFeatureItem } from "@/types/feature";

class FeatureController {
  async getItems({ farmer_id }: { farmer_id: string }): Promise<DbResult<IFeatureItem[]>> {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("feature_table")
        .select("*")
        .eq("farmer_id", farmer_id)
        .eq("is_deleted", false)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async getItemById({ id }: { id: string }): Promise<DbResult<IFeatureItem>> {
    const supabase = await createClient();
    try {
      const { data, error } = await supabase
        .from("feature_table")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async createItem({ data }: { data: FeatureInsert }): Promise<DbResult<IFeatureItem>> {
    const supabase = await createClient();
    try {
      const { data: result, error } = await supabase
        .from("feature_table")
        .insert(data)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async updateItem({ id, data }: { id: string; data: FeatureUpdate }) {
    const supabase = await createClient();
    try {
      const { data: result, error } = await supabase
        .from("feature_table")
        .update(data)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return { data: result, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  async deleteItem({ id }: { id: string }) {
    const supabase = await createClient();
    try {
      // Use RPC for soft delete; replace rpc name as needed
      const { data, error } = await supabase.rpc("soft_delete_feature", {
        p_feature_id: id,
      });
      if (error) throw new Error(error.message);
      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }
}

export const featureController = new FeatureController();
