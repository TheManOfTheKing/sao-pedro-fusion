/**
 * Unified type exports
 * Import shared types from this single entry point.
 */

export type * from "../drizzle/schema";
export * from "./_core/errors";

// ========================================================================
// Menu Digital Types - Supabase Schema
// ========================================================================

export type MenuLanguage = "pt" | "en" | "es" | "fr" | "de" | "it";
export type TranslationEntityType = "category" | "menu_item";
export type TranslationField = "name" | "description";

// Category
export interface Category {
  id: number;
  name_pt: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Menu Item
export interface MenuItem {
  id: number;
  category_id: number;
  name_pt: string;
  description_pt: string | null;
  price: number; // in cents
  image_url: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  is_spicy: boolean;
  is_featured: boolean;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Translation
export interface Translation {
  id: number;
  entity_type: TranslationEntityType;
  entity_id: number;
  field_name: TranslationField;
  language: MenuLanguage;
  translated_text: string;
  created_at: string;
  updated_at: string;
}

// ========================================================================
// API Response Types
// ========================================================================

export interface CategoryWithName {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface MenuItemWithTranslations {
  id: number;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  displayOrder: number;
}

export interface CategoryWithItems {
  id: number;
  name: string;
  slug: string;
  displayOrder: number;
  items: MenuItemWithTranslations[];
}

// ========================================================================
// Form Input Types
// ========================================================================

export interface CreateMenuItemInput {
  categoryId: number;
  namePt: string;
  descriptionPt?: string;
  price: number;
  imageUrl?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  isFeatured?: boolean;
  isAvailable?: boolean;
  displayOrder?: number;
  translations?: {
    language: MenuLanguage;
    name?: string;
    description?: string;
  }[];
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
  id: number;
}

export interface CreateTranslationInput {
  entityType: TranslationEntityType;
  entityId: number;
  fieldName: TranslationField;
  language: MenuLanguage;
  translatedText: string;
}
