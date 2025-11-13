import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { createClient } from "@supabase/supabase-js";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: { id: string; email?: string } | null;
};

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || "https://codaniddkekifbbgbmcs.supabase.co";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: { id: string; email?: string } | null = null;

  try {
    // Get authorization header or cookie
    const authHeader = opts.req.headers.authorization;
    const token = authHeader?.replace("Bearer ", "") || 
                  opts.req.headers.cookie?.match(/sb-access-token=([^;]+)/)?.[1] ||
                  opts.req.headers.cookie?.match(/sb-auth-token=([^;]+)/)?.[1];

    if (token) {
      // Create Supabase client to verify token
      const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      const { data: { user: supabaseUser }, error } = await supabase.auth.getUser(token);
      
      if (!error && supabaseUser) {
        user = {
          id: supabaseUser.id,
          email: supabaseUser.email,
        };
      }
    }
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
