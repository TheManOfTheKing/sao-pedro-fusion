import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as supabase from "./supabase";
import type { MenuLanguage, CategoryWithItems, MenuItemWithTranslations } from "@shared/types";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(() => {
      // Logout is handled by Supabase on the client side
      return {
        success: true,
      } as const;
    }),
  }),

  // ========================================================================
  // Public Menu Router - Accessible without authentication
  // ========================================================================
  menu: router({
    // Get all categories with optional translations
    getCategories: publicProcedure
      .input(
        z
          .object({
            language: z.enum(["pt", "en", "es", "fr", "de", "it"]).optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const categories = await supabase.getAllCategories();
        const language = input?.language || "pt";

        if (language === "pt") {
          return categories.map((cat) => ({
            id: cat.id,
            name: cat.name_pt,
            slug: cat.slug,
            displayOrder: cat.display_order,
          }));
        }

        // Get translations for each category
        const categoriesWithTranslations = await Promise.all(
          categories.map(async (cat) => {
            const translations = await supabase.getTranslations("category", cat.id, language);
            const nameTranslation = translations.find((t) => t.field_name === "name");

            return {
              id: cat.id,
              name: nameTranslation?.translated_text || cat.name_pt,
              slug: cat.slug,
              displayOrder: cat.display_order,
            };
          })
        );

        return categoriesWithTranslations;
      }),

    // Get complete menu (all categories with items and translations)
    getCompleteMenu: publicProcedure
      .input(
        z
          .object({
            language: z.enum(["pt", "en", "es", "fr", "de", "it"]).optional(),
          })
          .optional()
      )
      .query(async ({ input }): Promise<CategoryWithItems[]> => {
        const categories = await supabase.getAllCategories();
        const allItems = await supabase.getAllMenuItems();
        const language = input?.language || "pt";

        const menuWithTranslations = await Promise.all(
          categories.map(async (cat) => {
            const categoryItems = allItems.filter((item) => item.category_id === cat.id);

            // Get category translations
            let categoryName = cat.name_pt;
            if (language !== "pt") {
              const catTranslations = await supabase.getTranslations("category", cat.id, language);
              const nameTranslation = catTranslations.find((t) => t.field_name === "name");
              categoryName = nameTranslation?.translated_text || cat.name_pt;
            }

            // Get items with translations
            const itemsWithTranslations: MenuItemWithTranslations[] = await Promise.all(
              categoryItems.map(async (item) => {
                let name = item.name_pt;
                let description = item.description_pt;

                if (language !== "pt") {
                  const itemTranslations = await supabase.getTranslations("menu_item", item.id, language);
                  const nameTranslation = itemTranslations.find((t) => t.field_name === "name");
                  const descTranslation = itemTranslations.find((t) => t.field_name === "description");
                  name = nameTranslation?.translated_text || item.name_pt;
                  description = descTranslation?.translated_text || item.description_pt;
                }

                return {
                  id: item.id,
                  name,
                  description,
                  price: item.price,
                  imageUrl: item.image_url,
                  isVegetarian: item.is_vegetarian,
                  isVegan: item.is_vegan,
                  isGlutenFree: item.is_gluten_free,
                  isSpicy: item.is_spicy,
                  isFeatured: item.is_featured,
                  isAvailable: item.is_available,
                  displayOrder: item.display_order,
                };
              })
            );

            return {
              id: cat.id,
              name: categoryName,
              slug: cat.slug,
              displayOrder: cat.display_order,
              items: itemsWithTranslations,
            };
          })
        );

        return menuWithTranslations;
      }),

    // Get active languages (public)
    getActiveLanguages: publicProcedure.query(async () => {
      return await supabase.getActiveLanguages();
    }),
  }),

  // ========================================================================
  // Admin Router - Protected procedures
  // ========================================================================
  admin: router({
    // Create new menu item
    createMenuItem: protectedProcedure
      .input(
        z.object({
          categoryId: z.number(),
          namePt: z.string().min(1),
          descriptionPt: z.string().optional(),
          price: z.number().int().positive(),
          imageUrl: z.string().url().optional(),
          isVegetarian: z.boolean().default(false),
          isVegan: z.boolean().default(false),
          isGlutenFree: z.boolean().default(false),
          isSpicy: z.boolean().default(false),
          isFeatured: z.boolean().default(false),
          isAvailable: z.boolean().default(true),
          displayOrder: z.number().int().default(0),
          translations: z
            .array(
              z.object({
                language: z.enum(["en", "es", "fr", "de", "it"]),
                name: z.string().optional(),
                description: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { translations, ...itemData } = input;

        // Create menu item
        const newItem = await supabase.createMenuItem({
          category_id: itemData.categoryId,
          name_pt: itemData.namePt,
          description_pt: itemData.descriptionPt || null,
          price: itemData.price,
          image_url: itemData.imageUrl || null,
          is_vegetarian: itemData.isVegetarian,
          is_vegan: itemData.isVegan,
          is_gluten_free: itemData.isGlutenFree,
          is_spicy: itemData.isSpicy,
          is_featured: itemData.isFeatured,
          is_available: itemData.isAvailable,
          display_order: itemData.displayOrder,
        });

        // Add translations if provided
        if (translations && translations.length > 0) {
          for (const trans of translations) {
            if (trans.name) {
              await supabase.upsertTranslation({
                entity_type: "menu_item",
                entity_id: newItem.id,
                field_name: "name",
                language: trans.language,
                translated_text: trans.name,
              });
            }
            if (trans.description) {
              await supabase.upsertTranslation({
                entity_type: "menu_item",
                entity_id: newItem.id,
                field_name: "description",
                language: trans.language,
                translated_text: trans.description,
              });
            }
          }
        }

        return { success: true, itemId: newItem.id };
      }),

    // Update menu item
    updateMenuItem: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          categoryId: z.number().optional(),
          namePt: z.string().min(1).optional(),
          descriptionPt: z.string().optional(),
          price: z.number().int().positive().optional(),
          imageUrl: z.string().url().optional(),
          isVegetarian: z.boolean().optional(),
          isVegan: z.boolean().optional(),
          isGlutenFree: z.boolean().optional(),
          isSpicy: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          isAvailable: z.boolean().optional(),
          displayOrder: z.number().int().optional(),
          translations: z
            .array(
              z.object({
                language: z.enum(["en", "es", "fr", "de", "it"]),
                name: z.string().optional(),
                description: z.string().optional(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, translations, ...updates } = input;

        // Update menu item
        const updateData: any = {};
        if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
        if (updates.namePt !== undefined) updateData.name_pt = updates.namePt;
        if (updates.descriptionPt !== undefined) updateData.description_pt = updates.descriptionPt;
        if (updates.price !== undefined) updateData.price = updates.price;
        if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
        if (updates.isVegetarian !== undefined) updateData.is_vegetarian = updates.isVegetarian;
        if (updates.isVegan !== undefined) updateData.is_vegan = updates.isVegan;
        if (updates.isGlutenFree !== undefined) updateData.is_gluten_free = updates.isGlutenFree;
        if (updates.isSpicy !== undefined) updateData.is_spicy = updates.isSpicy;
        if (updates.isFeatured !== undefined) updateData.is_featured = updates.isFeatured;
        if (updates.isAvailable !== undefined) updateData.is_available = updates.isAvailable;
        if (updates.displayOrder !== undefined) updateData.display_order = updates.displayOrder;

        if (Object.keys(updateData).length > 0) {
          await supabase.updateMenuItem(id, updateData);
        }

        // Update translations if provided
        if (translations && translations.length > 0) {
          for (const trans of translations) {
            if (trans.name) {
              await supabase.upsertTranslation({
                entity_type: "menu_item",
                entity_id: id,
                field_name: "name",
                language: trans.language,
                translated_text: trans.name,
              });
            }
            if (trans.description) {
              await supabase.upsertTranslation({
                entity_type: "menu_item",
                entity_id: id,
                field_name: "description",
                language: trans.language,
                translated_text: trans.description,
              });
            }
          }
        }

        return { success: true };
      }),

    // Delete menu item
    deleteMenuItem: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await supabase.deleteMenuItem(input.id);
        return { success: true };
      }),

    // Toggle availability
    updateAvailability: protectedProcedure
      .input(
        z.object({
          itemId: z.number(),
          isAvailable: z.boolean(),
        })
      )
      .mutation(async ({ input }) => {
        await supabase.updateMenuItemAvailability(input.itemId, input.isAvailable);
        return { success: true };
      }),

    // Get item with all translations
    getItemWithTranslations: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const item = await supabase.getMenuItemById(input.id);
        if (!item) {
          throw new Error("Item not found");
        }

        const allTranslations = await supabase.getTranslations("menu_item", input.id);

        return {
          item,
          translations: allTranslations,
        };
      }),

    // Get active languages
    getActiveLanguages: protectedProcedure.query(async () => {
      try {
        return await supabase.getActiveLanguages();
      } catch (error) {
        console.error("[tRPC] Error in getActiveLanguages:", error);
        // Return default on error
        return ["pt"];
      }
    }),

    // Update active languages
    updateActiveLanguages: protectedProcedure
      .input(
        z.object({
          languages: z.array(z.enum(["pt", "en", "es", "fr", "de", "it"])),
        })
      )
      .mutation(async ({ input }) => {
        await supabase.updateActiveLanguages(input.languages);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
