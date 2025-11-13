import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env";

if (!ENV.supabaseUrl) {
  console.warn("[Supabase] SUPABASE_URL is not defined. API operations will fail.");
}
if (!ENV.supabaseServiceRoleKey) {
  console.warn("[Supabase] SUPABASE_SERVICE_ROLE_KEY is not defined. Protected operations will fail.");
}

export const supabaseAdmin = createClient(
  ENV.supabaseUrl || "https://placeholder.supabase.co",
  ENV.supabaseServiceRoleKey || "placeholder-key",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
