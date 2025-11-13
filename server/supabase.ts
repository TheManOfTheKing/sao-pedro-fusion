import { createClient } from "@supabase/supabase-js";
import type {
  Category,
  MenuItem,
  Translation,
  MenuLanguage,
  TranslationEntityType,
  TranslationField,
} from "@shared/types";

// Supabase configuration
const SUPABASE_URL = "https://codaniddkekifbbgbmcs.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZGFuaWRka2VraWZiYmdibWNzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzA0MTYxMiwiZXhwIjoyMDc4NjE3NjEyfQ.UyZwYGqVJRMTWMbu8idYAH4KrCGirTqnUub4DWUSYt4";

// Create Supabase client with service role (bypasses RLS for admin operations)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// ========================================================================
// Category Queries
// ========================================================================

export async function getAllCategories(): Promise<Category[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[Supabase] Error fetching categories:", error);
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  return data || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[Supabase] Error fetching category:", error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("[Supabase] Error fetching category:", error);
    throw new Error(`Failed to fetch category: ${error.message}`);
  }

  return data;
}

// ========================================================================
// Menu Item Queries
// ========================================================================

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[Supabase] Error fetching menu items:", error);
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return data || [];
}

export async function getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[Supabase] Error fetching menu items:", error);
    throw new Error(`Failed to fetch menu items: ${error.message}`);
  }

  return data || [];
}

export async function getMenuItemById(id: number): Promise<MenuItem | null> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("[Supabase] Error fetching menu item:", error);
    throw new Error(`Failed to fetch menu item: ${error.message}`);
  }

  return data;
}

export async function createMenuItem(item: Omit<MenuItem, "id" | "created_at" | "updated_at">): Promise<MenuItem> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert(item)
    .select()
    .single();

  if (error) {
    console.error("[Supabase] Error creating menu item:", error);
    throw new Error(`Failed to create menu item: ${error.message}`);
  }

  return data;
}

export async function updateMenuItem(
  id: number,
  updates: Partial<Omit<MenuItem, "id" | "created_at" | "updated_at">>
): Promise<MenuItem> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[Supabase] Error updating menu item:", error);
    throw new Error(`Failed to update menu item: ${error.message}`);
  }

  return data;
}

export async function deleteMenuItem(id: number): Promise<void> {
  const { error } = await supabaseAdmin.from("menu_items").delete().eq("id", id);

  if (error) {
    console.error("[Supabase] Error deleting menu item:", error);
    throw new Error(`Failed to delete menu item: ${error.message}`);
  }
}

export async function updateMenuItemAvailability(id: number, isAvailable: boolean): Promise<void> {
  const { error } = await supabaseAdmin
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) {
    console.error("[Supabase] Error updating availability:", error);
    throw new Error(`Failed to update availability: ${error.message}`);
  }
}

// ========================================================================
// Translation Queries
// ========================================================================

export async function getTranslations(
  entityType: TranslationEntityType,
  entityId: number,
  language?: MenuLanguage
): Promise<Translation[]> {
  let query = supabaseAdmin
    .from("translations")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (language) {
    query = query.eq("language", language);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[Supabase] Error fetching translations:", error);
    throw new Error(`Failed to fetch translations: ${error.message}`);
  }

  return data || [];
}

export async function upsertTranslation(translation: Omit<Translation, "id" | "created_at" | "updated_at">): Promise<Translation> {
  const { data, error } = await supabaseAdmin
    .from("translations")
    .upsert(translation, {
      onConflict: "entity_type,entity_id,field_name,language",
    })
    .select()
    .single();

  if (error) {
    console.error("[Supabase] Error upserting translation:", error);
    throw new Error(`Failed to upsert translation: ${error.message}`);
  }

  return data;
}

export async function deleteTranslations(entityType: TranslationEntityType, entityId: number): Promise<void> {
  const { error } = await supabaseAdmin
    .from("translations")
    .delete()
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error) {
    console.error("[Supabase] Error deleting translations:", error);
    throw new Error(`Failed to delete translations: ${error.message}`);
  }
}

// ========================================================================
// Menu Settings Queries
// ========================================================================

export async function getMenuSetting(settingKey: string): Promise<any> {
  const { data, error } = await supabaseAdmin
    .from("menu_settings")
    .select("setting_value")
    .eq("setting_key", settingKey)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Not found
      return null;
    }
    console.error("[Supabase] Error fetching menu setting:", error);
    throw new Error(`Failed to fetch menu setting: ${error.message}`);
  }

  // setting_value is jsonb, so we return it directly
  return data?.setting_value || null;
}

export async function getActiveLanguages(): Promise<MenuLanguage[]> {
  try {
    const settingValue = await getMenuSetting("active_languages");
    
    if (!settingValue) {
      // Default to Portuguese if no setting exists
      console.log("[Supabase] No active_languages setting found, defaulting to Portuguese");
      return ["pt"];
    }

    // setting_value is jsonb, so it should already be parsed
    // If it's already an array, use it directly; otherwise try to parse
    const languages = Array.isArray(settingValue) 
      ? settingValue 
      : (typeof settingValue === 'string' ? JSON.parse(settingValue) : settingValue);
    
    // Validate that all languages are valid MenuLanguage codes
    const validLanguages: MenuLanguage[] = ["pt", "en", "es", "fr", "de", "it"];
    const filtered = languages.filter((lang: string) => validLanguages.includes(lang as MenuLanguage)) as MenuLanguage[];
    
    // Ensure at least one language is returned
    const result = filtered.length > 0 ? filtered : ["pt"];
    console.log("[Supabase] Active languages loaded:", result);
    return result;
  } catch (error) {
    console.error("[Supabase] Error getting active_languages:", error);
    // Return default on any error
    return ["pt"];
  }
}

export async function updateActiveLanguages(languages: MenuLanguage[]): Promise<void> {
  // First, check if the setting exists
  const { data: existing } = await supabaseAdmin
    .from("menu_settings")
    .select("id")
    .eq("setting_key", "active_languages")
    .single();

  if (existing) {
    // Update existing setting
    const { error } = await supabaseAdmin
      .from("menu_settings")
      .update({
        setting_value: languages,
        updated_at: new Date().toISOString(),
      })
      .eq("setting_key", "active_languages");

    if (error) {
      console.error("[Supabase] Error updating active_languages:", error);
      throw new Error(`Failed to update active_languages: ${error.message}`);
    }
  } else {
    // Create new setting
    const { error } = await supabaseAdmin
      .from("menu_settings")
      .insert({
        setting_key: "active_languages",
        setting_value: languages,
      });

    if (error) {
      console.error("[Supabase] Error creating active_languages:", error);
      throw new Error(`Failed to create active_languages: ${error.message}`);
    }
  }
}
