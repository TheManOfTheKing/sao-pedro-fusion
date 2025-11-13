-- Script de seed para popular o banco de dados com dados de exemplo
-- Execute este script após executar schema.sql

-- ========================================================================
-- Inserir Categorias
-- ========================================================================
INSERT INTO public.categories (name_pt, slug, display_order, is_active) VALUES
  ('Entradas', 'entradas', 1, true),
  ('Pratos Principais', 'pratos-principais', 2, true),
  ('Sobremesas', 'sobremesas', 3, true),
  ('Bebidas', 'bebidas', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- ========================================================================
-- Inserir Itens de Menu - Entradas
-- ========================================================================
INSERT INTO public.menu_items (
  category_id,
  name_pt,
  description_pt,
  price,
  is_vegetarian,
  is_vegan,
  is_gluten_free,
  is_spicy,
  is_featured,
  is_available,
  display_order
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'entradas'),
    'Bruschetta Tradicional',
    'Pão italiano tostado com tomate fresco, manjericão, alho e azeite extra virgem',
    850,
    true,
    true,
    false,
    false,
    true,
    true,
    1
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'entradas'),
    'Carpaccio de Salmão',
    'Finas fatias de salmão fresco com alcaparras, cebola roxa e molho de mostarda',
    1250,
    false,
    false,
    true,
    false,
    false,
    true,
    2
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'entradas'),
    'Salada Caprese',
    'Tomate, mozzarella di bufala, manjericão fresco e azeite de oliva',
    950,
    true,
    false,
    true,
    false,
    false,
    true,
    3
  );

-- ========================================================================
-- Inserir Itens de Menu - Pratos Principais
-- ========================================================================
INSERT INTO public.menu_items (
  category_id,
  name_pt,
  description_pt,
  price,
  is_vegetarian,
  is_vegan,
  is_gluten_free,
  is_spicy,
  is_featured,
  is_available,
  display_order
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'pratos-principais'),
    'Bacalhau à Brás',
    'Bacalhau desfiado com batata palha, ovos, cebola e azeitonas',
    1850,
    false,
    false,
    true,
    false,
    true,
    true,
    1
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'pratos-principais'),
    'Risotto de Cogumelos',
    'Arroz arbóreo cremoso com mix de cogumelos selvagens e parmesão',
    1650,
    true,
    false,
    true,
    false,
    false,
    true,
    2
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'pratos-principais'),
    'Polvo à Lagareiro',
    'Polvo grelhado com batatas a murro, alho e azeite',
    2250,
    false,
    false,
    true,
    false,
    true,
    true,
    3
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'pratos-principais'),
    'Lasanha Vegetariana',
    'Camadas de massa com legumes grelhados, molho bechamel e queijo',
    1450,
    true,
    false,
    false,
    false,
    false,
    true,
    4
  );

-- ========================================================================
-- Inserir Itens de Menu - Sobremesas
-- ========================================================================
INSERT INTO public.menu_items (
  category_id,
  name_pt,
  description_pt,
  price,
  is_vegetarian,
  is_vegan,
  is_gluten_free,
  is_spicy,
  is_featured,
  is_available,
  display_order
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'sobremesas'),
    'Pastel de Nata',
    'Tradicional pastel português com massa folhada e creme de ovos',
    450,
    true,
    false,
    false,
    false,
    true,
    true,
    1
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'sobremesas'),
    'Tiramisu',
    'Sobremesa italiana com café, mascarpone e cacau',
    650,
    true,
    false,
    false,
    false,
    false,
    true,
    2
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'sobremesas'),
    'Mousse de Chocolate',
    'Mousse cremoso de chocolate belga 70% cacau',
    550,
    true,
    false,
    true,
    false,
    false,
    true,
    3
  );

-- ========================================================================
-- Inserir Itens de Menu - Bebidas
-- ========================================================================
INSERT INTO public.menu_items (
  category_id,
  name_pt,
  description_pt,
  price,
  is_vegetarian,
  is_vegan,
  is_gluten_free,
  is_spicy,
  is_featured,
  is_available,
  display_order
) VALUES
  (
    (SELECT id FROM public.categories WHERE slug = 'bebidas'),
    'Vinho Tinto da Casa',
    'Vinho português selecionado (garrafa)',
    1800,
    true,
    true,
    true,
    false,
    false,
    true,
    1
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'bebidas'),
    'Água Mineral',
    'Água mineral natural (500ml)',
    200,
    true,
    true,
    true,
    false,
    false,
    true,
    2
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'bebidas'),
    'Café Expresso',
    'Café expresso italiano',
    150,
    true,
    true,
    true,
    false,
    false,
    true,
    3
  ),
  (
    (SELECT id FROM public.categories WHERE slug = 'bebidas'),
    'Sumo Natural de Laranja',
    'Sumo de laranja natural espremido na hora',
    450,
    true,
    true,
    true,
    false,
    false,
    true,
    4
  );

-- ========================================================================
-- Inserir Traduções - Categorias
-- ========================================================================
INSERT INTO public.translations (entity_type, entity_id, field_name, language, translated_text) VALUES
  -- Entradas
  ('category', (SELECT id FROM public.categories WHERE slug = 'entradas'), 'name', 'en', 'Starters'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'entradas'), 'name', 'es', 'Entrantes'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'entradas'), 'name', 'fr', 'Entrées'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'entradas'), 'name', 'de', 'Vorspeisen'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'entradas'), 'name', 'it', 'Antipasti'),
  
  -- Pratos Principais
  ('category', (SELECT id FROM public.categories WHERE slug = 'pratos-principais'), 'name', 'en', 'Main Courses'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'pratos-principais'), 'name', 'es', 'Platos Principales'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'pratos-principais'), 'name', 'fr', 'Plats Principaux'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'pratos-principais'), 'name', 'de', 'Hauptgerichte'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'pratos-principais'), 'name', 'it', 'Piatti Principali'),
  
  -- Sobremesas
  ('category', (SELECT id FROM public.categories WHERE slug = 'sobremesas'), 'name', 'en', 'Desserts'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'sobremesas'), 'name', 'es', 'Postres'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'sobremesas'), 'name', 'fr', 'Desserts'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'sobremesas'), 'name', 'de', 'Desserts'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'sobremesas'), 'name', 'it', 'Dolci'),
  
  -- Bebidas
  ('category', (SELECT id FROM public.categories WHERE slug = 'bebidas'), 'name', 'en', 'Drinks'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'bebidas'), 'name', 'es', 'Bebidas'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'bebidas'), 'name', 'fr', 'Boissons'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'bebidas'), 'name', 'de', 'Getränke'),
  ('category', (SELECT id FROM public.categories WHERE slug = 'bebidas'), 'name', 'it', 'Bevande')
ON CONFLICT (entity_type, entity_id, field_name, language) DO NOTHING;

-- ========================================================================
-- Mensagem de Sucesso
-- ========================================================================
DO $$
BEGIN
  RAISE NOTICE 'Seed completo! Categorias e itens de menu inseridos com sucesso.';
END $$;
