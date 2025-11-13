-- Table to store menu settings including active languages
CREATE TABLE IF NOT EXISTS public.menu_settings (
  id serial PRIMARY KEY,
  setting_key text NOT NULL UNIQUE,
  setting_value jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert default active languages (all languages enabled by default)
INSERT INTO public.menu_settings (setting_key, setting_value)
VALUES ('active_languages', '["pt", "en", "es", "fr", "de", "it"]'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS menu_settings_key_idx ON public.menu_settings(setting_key);

-- Enable RLS
ALTER TABLE public.menu_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access
DROP POLICY IF EXISTS "menu_settings_select_public" ON public.menu_settings;
CREATE POLICY "menu_settings_select_public" ON public.menu_settings
  FOR SELECT
  USING (true);

-- Policy: Allow authenticated users to insert
DROP POLICY IF EXISTS "menu_settings_insert_authenticated" ON public.menu_settings;
CREATE POLICY "menu_settings_insert_authenticated" ON public.menu_settings
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to update
DROP POLICY IF EXISTS "menu_settings_update_authenticated" ON public.menu_settings;
CREATE POLICY "menu_settings_update_authenticated" ON public.menu_settings
  FOR UPDATE
  USING (true);

