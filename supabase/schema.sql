-- Supabase schema for São Pedro Menu Digital
-- Execute this script no editor SQL do Supabase.

-- ========================================================================
-- Enums
-- ========================================================================
DO $$ BEGIN
  CREATE TYPE public.translation_entity_type AS ENUM ('category', 'menu_item');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.translation_field AS ENUM ('name', 'description');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.menu_language AS ENUM ('pt', 'en', 'es', 'fr', 'de', 'it');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ========================================================================
-- Tables
-- ========================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  role text NOT NULL DEFAULT 'user',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.categories (
  id serial PRIMARY KEY,
  name_pt text NOT NULL,
  slug text NOT NULL UNIQUE,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.menu_items (
  id serial PRIMARY KEY,
  category_id integer NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name_pt text NOT NULL,
  description_pt text,
  price integer NOT NULL,
  image_url text,
  is_vegetarian boolean NOT NULL DEFAULT false,
  is_vegan boolean NOT NULL DEFAULT false,
  is_gluten_free boolean NOT NULL DEFAULT false,
  is_spicy boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  is_available boolean NOT NULL DEFAULT true,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.translations (
  id serial PRIMARY KEY,
  entity_type public.translation_entity_type NOT NULL,
  entity_id integer NOT NULL,
  field_name public.translation_field NOT NULL,
  language public.menu_language NOT NULL,
  translated_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (entity_type, entity_id, field_name, language)
);

-- ========================================================================
-- Indexes auxiliares
-- ========================================================================
CREATE INDEX IF NOT EXISTS menu_items_category_idx ON public.menu_items(category_id);
CREATE INDEX IF NOT EXISTS menu_items_display_order_idx ON public.menu_items(display_order);
CREATE INDEX IF NOT EXISTS translations_entity_idx
  ON public.translations(entity_type, entity_id, language);

-- ========================================================================
-- Row Level Security
-- ========================================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;

-- ========================================================================
-- Policies (idempotentes)
-- ========================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'user_profiles'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'user_profiles'
        AND policyname = 'user_profiles_select_own'
    ) THEN
      CREATE POLICY user_profiles_select_own
        ON public.user_profiles
        FOR SELECT USING (auth.uid() = user_id);
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'categories'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'categories'
        AND policyname = 'categories_public_select'
    ) THEN
      CREATE POLICY categories_public_select
        ON public.categories
        FOR SELECT USING (true);
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'menu_items'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'menu_items'
        AND policyname = 'menu_items_public_select'
    ) THEN
      CREATE POLICY menu_items_public_select
        ON public.menu_items
        FOR SELECT USING (true);
    END IF;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables
    WHERE schemaname = 'public' AND tablename = 'translations'
  ) THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'translations'
        AND policyname = 'translations_public_select'
    ) THEN
      CREATE POLICY translations_public_select
        ON public.translations
        FOR SELECT USING (true);
    END IF;
  END IF;
END $$;

-- ========================================================================
-- Trigger helper para updated_at
-- ========================================================================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'categories'
  ) THEN
    CREATE TRIGGER categories_touch_updated
    BEFORE UPDATE ON public.categories
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'menu_items'
  ) THEN
    CREATE TRIGGER menu_items_touch_updated
    BEFORE UPDATE ON public.menu_items
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'translations'
  ) THEN
    CREATE TRIGGER translations_touch_updated
    BEFORE UPDATE ON public.translations
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'user_profiles'
  ) THEN
    CREATE TRIGGER user_profiles_touch_updated
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
  END IF;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
