import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { supabaseAdmin } from "./supabaseClient";
import { getUserProfile, upsertUserProfile, type UserProfile } from "../db";
import { ENV } from "./env";

export type AppUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
};

async function resolveUser(req: CreateExpressContextOptions["req"]): Promise<AppUser | null> {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return null;
  }

  const accessToken = authorization.replace("Bearer ", "").trim();
  if (!accessToken) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(accessToken);
  if (error || !data.user) {
    return null;
  }

  const supaUser = data.user;
  const email = supaUser.email ?? "";
  const fullName =
    (supaUser.user_metadata?.full_name as string | undefined) ??
    (supaUser.user_metadata?.name as string | undefined) ??
    null;

  let profile: UserProfile | null = null;
  try {
    profile = await getUserProfile(supaUser.id);
  } catch (err) {
    console.error("[Auth] Failed to load user profile", err);
  }

  const role =
    profile?.role ??
    (ENV.adminEmail && email?.toLowerCase() === ENV.adminEmail.toLowerCase()
      ? "admin"
      : "user");

  if (!profile) {
    try {
      await upsertUserProfile({
        userId: supaUser.id,
        fullName: fullName ?? email,
        role,
      });
    } catch (err) {
      console.error("[Auth] Failed to upsert user profile", err);
    }
  }

  return {
    id: supaUser.id,
    email,
    name: profile?.fullName ?? fullName ?? email,
    role,
  };
}

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AppUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const user = await resolveUser(opts.req);

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
