import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { translateMenuItem } from "./_core/translation";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
  }),

  // Public menu router - accessible without authentication
  menu: router({
    // Get active languages
    getActiveLanguages: publicProcedure
      .query(async () => {
        return await db.getActiveLanguages();
      }),
    
    // Get all categories with optional translations
    getCategories: publicProcedure
      .input(z.object({ language: z.enum(["pt", "en", "es", "fr", "de", "it"]).optional() }).optional())
      .query(async ({ input }) => {
        const categories = await db.getAllCategories();
        
        if (!input?.language || input.language === "pt") {
          return categories.map(cat => ({
            id: cat.id,
            name: cat.namePt,
            slug: cat.slug,
            displayOrder: cat.displayOrder,
          }));
        }
        
        // Get translations for each category
        const categoriesWithTranslations = await Promise.all(
          categories.map(async (cat) => {
            const translations = await db.getTranslations("category", cat.id, input.language!);
            const nameTranslation = translations.find(t => t.fieldName === "name");
            
            return {
              id: cat.id,
              name: nameTranslation?.translatedText || cat.namePt,
              slug: cat.slug,
              displayOrder: cat.displayOrder,
            };
          })
        );
        
        return categoriesWithTranslations;
      }),
    
    // Get menu items by category with translations
    getMenuByCategory: publicProcedure
      .input(z.object({ 
        categorySlug: z.string(),
        language: z.enum(["pt", "en", "es", "fr", "de", "it"]).optional()
      }))
      .query(async ({ input }) => {
        const category = await db.getCategoryBySlug(input.categorySlug);
        if (!category) {
          throw new Error("Category not found");
        }
        
        const items = await db.getMenuItemsByCategory(category.id);
        
        if (!input.language || input.language === "pt") {
          return items.map(item => ({
            id: item.id,
            name: item.namePt,
            description: item.descriptionPt,
            price: item.price,
            imageUrl: item.imageUrl,
            isVegetarian: item.isVegetarian,
            isVegan: item.isVegan,
            isGlutenFree: item.isGlutenFree,
            isSpicy: item.isSpicy,
            isFeatured: item.isFeatured,
            isAvailable: item.isAvailable,
          }));
        }
        
        // Get translations for each item
        const itemsWithTranslations = await Promise.all(
          items.map(async (item) => {
            const translations = await db.getTranslations("menu_item", item.id, input.language!);
            const nameTranslation = translations.find(t => t.fieldName === "name");
            const descTranslation = translations.find(t => t.fieldName === "description");
            
            return {
              id: item.id,
              name: nameTranslation?.translatedText || item.namePt,
              description: descTranslation?.translatedText || item.descriptionPt,
              price: item.price,
              imageUrl: item.imageUrl,
              isVegetarian: item.isVegetarian,
              isVegan: item.isVegan,
              isGlutenFree: item.isGlutenFree,
              isSpicy: item.isSpicy,
              isFeatured: item.isFeatured,
              isAvailable: item.isAvailable,
            };
          })
        );
        
        return itemsWithTranslations;
      }),
    
    // Get complete menu (all categories with items)
    getCompleteMenu: publicProcedure
      .input(z.object({ language: z.enum(["pt", "en", "es", "fr", "de", "it"]).optional() }).optional())
      .query(async ({ input }) => {
        const categories = await db.getAllCategories();
        const allItems = await db.getAllMenuItems();
        
        const language = input?.language || "pt";
        
        const menuWithTranslations = await Promise.all(
          categories.map(async (cat) => {
            const categoryItems = allItems.filter(item => item.categoryId === cat.id);
            
            // Get category translations
            let categoryName = cat.namePt;
            if (language !== "pt") {
              const catTranslations = await db.getTranslations("category", cat.id, language);
              const nameTranslation = catTranslations.find(t => t.fieldName === "name");
              categoryName = nameTranslation?.translatedText || cat.namePt;
            }
            
            // Get items with translations
            const itemsWithTranslations = await Promise.all(
              categoryItems.map(async (item) => {
                let name = item.namePt;
                let description = item.descriptionPt;
                
                if (language !== "pt") {
                  const itemTranslations = await db.getTranslations("menu_item", item.id, language);
                  const nameTranslation = itemTranslations.find(t => t.fieldName === "name");
                  const descTranslation = itemTranslations.find(t => t.fieldName === "description");
                  name = nameTranslation?.translatedText || item.namePt;
                  description = descTranslation?.translatedText || item.descriptionPt;
                }
                
                return {
                  id: item.id,
                  name,
                  description,
                  price: item.price,
                  imageUrl: item.imageUrl,
                  isVegetarian: item.isVegetarian,
                  isVegan: item.isVegan,
                  isGlutenFree: item.isGlutenFree,
                  isSpicy: item.isSpicy,
                  isFeatured: item.isFeatured,
                  isAvailable: item.isAvailable,
                  displayOrder: item.displayOrder,
                };
              })
            );
            
            return {
              id: cat.id,
              name: categoryName,
              slug: cat.slug,
              displayOrder: cat.displayOrder,
              items: itemsWithTranslations.sort((a, b) => a.displayOrder - b.displayOrder),
            };
          })
        );
        
        return menuWithTranslations.sort((a, b) => a.displayOrder - b.displayOrder);
      }),
  }),
  
  // Admin router - requires authentication
  admin: router({
    // Get active languages
    getActiveLanguages: protectedProcedure
      .query(async () => {
        return await db.getActiveLanguages();
      }),
    
    // Update active languages
    updateActiveLanguages: protectedProcedure
      .input(z.object({
        languages: z.array(z.string()),
      }))
      .mutation(async ({ input }) => {
        await db.updateActiveLanguages(input.languages);
        return { success: true };
      }),
    
    // Create category
    createCategory: protectedProcedure
      .input(z.object({
        namePt: z.string(),
        slug: z.string(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createCategory({
          namePt: input.namePt,
          slug: input.slug,
          displayOrder: input.displayOrder || 0,
        });
        return { success: true };
      }),
    
    // Create menu item
    createMenuItem: protectedProcedure
      .input(z.object({
        categoryId: z.number(),
        namePt: z.string(),
        descriptionPt: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        isVegetarian: z.boolean().optional(),
        isVegan: z.boolean().optional(),
        isGlutenFree: z.boolean().optional(),
        isSpicy: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        isAvailable: z.boolean().optional(),
        displayOrder: z.number().optional(),
        translations: z.array(z.object({
          language: z.string(),
          name: z.string(),
          description: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { translations, ...itemData } = input;
        
        const createdItem = await db.createMenuItem({
          categoryId: itemData.categoryId,
          namePt: itemData.namePt,
          descriptionPt: itemData.descriptionPt,
          price: itemData.price,
          imageUrl: itemData.imageUrl,
          isVegetarian: itemData.isVegetarian ?? false,
          isVegan: itemData.isVegan ?? false,
          isGlutenFree: itemData.isGlutenFree ?? false,
          isSpicy: itemData.isSpicy ?? false,
          isFeatured: itemData.isFeatured ?? false,
          isAvailable: itemData.isAvailable !== false,
          displayOrder: itemData.displayOrder || 0,
        });
        
        // Auto-translate if no translations provided or if translations array is empty
        let translationsToSave = translations;
        if (!translationsToSave || translationsToSave.length === 0) {
          try {
            const autoTranslations = await translateMenuItem(
              itemData.namePt,
              itemData.descriptionPt
            );
            translationsToSave = autoTranslations;
          } catch (error) {
            console.error("[Router] Error auto-translating menu item:", error);
            // Continue without translations if auto-translation fails
          }
        }
        
        // Add translations
        if (translationsToSave && translationsToSave.length > 0) {
          for (const trans of translationsToSave) {
            if (trans.name) {
              await db.upsertTranslation({
                entityType: "menu_item",
                entityId: createdItem.id,
                fieldName: "name",
                language: trans.language,
                translatedText: trans.name,
              });
            }
            if (trans.description) {
              await db.upsertTranslation({
                entityType: "menu_item",
                entityId: createdItem.id,
                fieldName: "description",
                language: trans.language,
                translatedText: trans.description,
              });
            }
          }
        }
        
        const item = await db.getMenuItemById(createdItem.id);
        const itemTranslations = await db.getAllTranslationsForEntity("menu_item", createdItem.id);

        return {
          success: true,
          item: {
            ...item,
            translations: itemTranslations,
          },
        };
      }),
    
    // Update item availability
    updateAvailability: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        isAvailable: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateMenuItemAvailability(input.itemId, input.isAvailable);
        return { success: true };
      }),
    
    // Get menu item by ID
    getMenuItem: protectedProcedure
      .input(z.object({ itemId: z.number() }))
      .query(async ({ input }) => {
        const item = await db.getMenuItemById(input.itemId);
        const translations = await db.getAllTranslationsForEntity("menu_item", input.itemId);
        return {
          ...item,
          translations: translations.map(t => ({
            language: t.language,
            name: t.fieldName === "name" ? t.translatedText : "",
            description: t.fieldName === "description" ? t.translatedText : "",
          })),
        };
      }),
    
    // Update menu item
    updateMenuItem: protectedProcedure
      .input(z.object({
        itemId: z.number(),
        categoryId: z.number(),
        namePt: z.string(),
        descriptionPt: z.string().optional(),
        price: z.number(),
        imageUrl: z.string().optional(),
        isVegetarian: z.boolean().optional(),
        isVegan: z.boolean().optional(),
        isGlutenFree: z.boolean().optional(),
        isSpicy: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        isAvailable: z.boolean().optional(),
        translations: z.array(z.object({
          language: z.string(),
          name: z.string(),
          description: z.string(),
        })).optional(),
      }))
      .mutation(async ({ input }) => {
        const { itemId, translations, ...itemData } = input;
        
        // Get existing item to check if name/description changed
        const existingItem = await db.getMenuItemById(itemId);
        const nameChanged = existingItem.namePt !== itemData.namePt;
        const descriptionChanged = existingItem.descriptionPt !== (itemData.descriptionPt || "");
        
        await db.updateMenuItem(itemId, {
          ...itemData,
          isVegetarian: itemData.isVegetarian ?? false,
          isVegan: itemData.isVegan ?? false,
          isGlutenFree: itemData.isGlutenFree ?? false,
          isSpicy: itemData.isSpicy ?? false,
          isFeatured: itemData.isFeatured ?? false,
          isAvailable: itemData.isAvailable ?? true,
        });
        
        // Auto-translate if name or description changed and no translations provided
        let translationsToSave = translations;
        if ((nameChanged || descriptionChanged) && (!translationsToSave || translationsToSave.length === 0)) {
          try {
            const autoTranslations = await translateMenuItem(
              itemData.namePt,
              itemData.descriptionPt
            );
            translationsToSave = autoTranslations;
          } catch (error) {
            console.error("[Router] Error auto-translating menu item on update:", error);
            // Continue without translations if auto-translation fails
          }
        }
        
        // Update translations
        if (translationsToSave && translationsToSave.length > 0) {
          for (const trans of translationsToSave) {
            if (trans.name) {
              await db.upsertTranslation({
                entityType: "menu_item",
                entityId: itemId,
                fieldName: "name",
                language: trans.language,
                translatedText: trans.name,
              });
            }
            if (trans.description) {
              await db.upsertTranslation({
                entityType: "menu_item",
                entityId: itemId,
                fieldName: "description",
                language: trans.language,
                translatedText: trans.description,
              });
            }
          }
        }
        
        return { success: true };
      }),
    
    // Add translation
    addTranslation: protectedProcedure
      .input(z.object({
        entityType: z.enum(["category", "menu_item"]),
        entityId: z.number(),
        fieldName: z.enum(["name", "description"]),
        language: z.enum(["en", "es", "fr", "de", "it"]),
        translatedText: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.upsertTranslation(input);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
