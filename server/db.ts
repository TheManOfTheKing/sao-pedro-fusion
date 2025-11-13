import { supabaseAdmin } from "./_core/supabaseClient";

export type MenuCategory = {
  id: number;
  namePt: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuItem = {
  id: number;
  categoryId: number;
  namePt: string;
  descriptionPt: string | null;
  price: number;
  imageUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type Translation = {
  id: number;
  entityType: "category" | "menu_item";
  entityId: number;
  fieldName: "name" | "description";
  language: string;
  translatedText: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  userId: string;
  fullName: string | null;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
};

export type MenuSettings = {
  id: number;
  settingKey: string;
  settingValue: any;
  createdAt: Date;
  updatedAt: Date;
};

function mapCategory(row: any): MenuCategory {
  return {
    id: row.id,
    namePt: row.name_pt,
    slug: row.slug,
    displayOrder: row.display_order,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapMenuItem(row: any): MenuItem {
  return {
    id: row.id,
    categoryId: row.category_id,
    namePt: row.name_pt,
    descriptionPt: row.description_pt,
    price: row.price,
    imageUrl: row.image_url,
    isVegetarian: row.is_vegetarian,
    isVegan: row.is_vegan,
    isGlutenFree: row.is_gluten_free,
    isSpicy: row.is_spicy,
    isFeatured: row.is_featured,
    isAvailable: row.is_available,
    displayOrder: row.display_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapTranslation(row: any): Translation {
  return {
    id: row.id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    fieldName: row.field_name,
    language: row.language,
    translatedText: row.translated_text,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

function mapProfile(row: any): UserProfile {
  return {
    userId: row.user_id,
    fullName: row.full_name,
    role: row.role,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getAllCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapCategory);
}

export async function getCategoryBySlug(slug: string): Promise<MenuCategory | undefined> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return undefined; // Not found
    throw error;
  }
  return data ? mapCategory(data) : undefined;
}

export async function getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapMenuItem);
}

export async function getAllMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapMenuItem);
}

export async function getTranslations(
  entityType: "category" | "menu_item",
  entityId: number,
  language: string
): Promise<Translation[]> {
  const { data, error } = await supabaseAdmin
    .from("translations")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .eq("language", language);

  if (error) throw error;
  return (data || []).map(mapTranslation);
}

export async function upsertTranslation(input: {
  entityType: "category" | "menu_item";
  entityId: number;
  fieldName: "name" | "description";
  language: string;
  translatedText: string;
}): Promise<void> {
  const { error } = await supabaseAdmin
    .from("translations")
    .upsert({
      entity_type: input.entityType,
      entity_id: input.entityId,
      field_name: input.fieldName,
      language: input.language,
      translated_text: input.translatedText,
    }, {
      onConflict: "entity_type,entity_id,field_name,language"
    });

  if (error) throw error;
}

export async function createCategory(input: {
  namePt: string;
  slug: string;
  displayOrder?: number;
  isActive?: boolean;
}): Promise<MenuCategory> {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({
      name_pt: input.namePt,
      slug: input.slug,
      display_order: input.displayOrder ?? 0,
      is_active: input.isActive ?? true,
    })
    .select()
    .single();

  if (error) throw error;
  return mapCategory(data);
}

export async function createMenuItem(input: {
  categoryId: number;
  namePt: string;
  descriptionPt?: string | null;
  price: number;
  imageUrl?: string | null;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
  isAvailable?: boolean;
  displayOrder?: number;
}): Promise<MenuItem> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert({
      category_id: input.categoryId,
      name_pt: input.namePt,
      description_pt: input.descriptionPt ?? null,
      price: input.price,
      image_url: input.imageUrl ?? null,
      is_vegetarian: input.isVegetarian ?? false,
      is_vegan: input.isVegan ?? false,
      is_gluten_free: input.isGlutenFree ?? false,
      is_spicy: input.isSpicy ?? false,
      is_featured: input.isFeatured ?? false,
      is_available: input.isAvailable ?? true,
      display_order: input.displayOrder ?? 0,
    })
    .select()
    .single();

  if (error) throw error;
  return mapMenuItem(data);
}

export async function updateMenuItemAvailability(
  itemId: number,
  isAvailable: boolean
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", itemId);

  if (error) throw error;
}

export async function getMenuItemById(itemId: number): Promise<MenuItem> {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (error) throw error;
  return mapMenuItem(data);
}

export async function getAllTranslationsForEntity(
  entityType: "category" | "menu_item",
  entityId: number
): Promise<Translation[]> {
  const { data, error } = await supabaseAdmin
    .from("translations")
    .select("*")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId);

  if (error) throw error;
  return (data || []).map(mapTranslation);
}

export async function updateMenuItem(
  itemId: number,
  input: {
    categoryId: number;
    namePt: string;
    descriptionPt?: string | null;
    price: number;
    imageUrl?: string | null;
    isVegetarian?: boolean;
    isVegan?: boolean;
    isGlutenFree?: boolean;
    isSpicy?: boolean;
    isFeatured?: boolean;
    isAvailable?: boolean;
    displayOrder?: number;
  }
): Promise<void> {
  const { error } = await supabaseAdmin
    .from("menu_items")
    .update({
      category_id: input.categoryId,
      name_pt: input.namePt,
      description_pt: input.descriptionPt ?? null,
      price: input.price,
      image_url: input.imageUrl ?? null,
      is_vegetarian: input.isVegetarian ?? false,
      is_vegan: input.isVegan ?? false,
      is_gluten_free: input.isGlutenFree ?? false,
      is_spicy: input.isSpicy ?? false,
      is_featured: input.isFeatured ?? false,
      is_available: input.isAvailable ?? true,
      display_order: input.displayOrder ?? 0,
    })
    .eq("id", itemId);

  if (error) throw error;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }
  return data ? mapProfile(data) : null;
}

export async function upsertUserProfile(input: {
  userId: string;
  fullName?: string | null;
  role?: "user" | "admin";
}): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from("user_profiles")
    .upsert({
      user_id: input.userId,
      full_name: input.fullName ?? null,
      role: input.role ?? "user",
    }, {
      onConflict: "user_id"
    })
    .select()
    .single();

  if (error) throw error;
  return mapProfile(data);
}

function mapMenuSettings(row: any): MenuSettings {
  return {
    id: row.id,
    settingKey: row.setting_key,
    settingValue: row.setting_value,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export async function getActiveLanguages(): Promise<string[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("menu_settings")
      .select("setting_value")
      .eq("setting_key", "active_languages")
      .single();

    if (error) {
      // If table doesn't exist or settings don't exist, return all languages as default
      console.warn("[DB] menu_settings table not found or error:", error.message);
      return ["pt", "en", "es", "fr", "de", "it"];
    }

    return (data?.setting_value as string[]) || ["pt", "en", "es", "fr", "de", "it"];
  } catch (error: any) {
    console.warn("[DB] Error getting active languages:", error?.message);
    // Return default languages if table doesn't exist
    return ["pt", "en", "es", "fr", "de", "it"];
  }
}

export async function updateActiveLanguages(languages: string[]): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from("menu_settings")
      .upsert({
        setting_key: "active_languages",
        setting_value: languages,
      }, {
        onConflict: "setting_key"
      });

    if (error) {
      // If table doesn't exist, provide helpful error message
      if (error.message?.includes("menu_settings") || error.code === "42P01") {
        throw new Error(
          "A tabela 'menu_settings' não foi encontrada. " +
          "Por favor, execute o script SQL em 'supabase/menu_settings.sql' no Supabase Dashboard."
        );
      }
      throw error;
    }
  } catch (error: any) {
    if (error.message?.includes("menu_settings")) {
      throw error;
    }
    throw new Error(
      `Erro ao atualizar idiomas: ${error?.message || "Tabela menu_settings não encontrada. " +
      "Execute o script SQL em 'supabase/menu_settings.sql' no Supabase Dashboard."}`
    );
  }
}
