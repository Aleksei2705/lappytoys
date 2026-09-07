import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import { site } from "@/data/site";

export type StoredReview = {
  id: string;
  name: string;
  text: string;
  course: string;
  rating: number;
  avatar_url?: string | null;
  reply_text?: string | null;
  reply_at?: string | null;
  approved?: boolean;
  created_at: string;
};

let client: SupabaseClient | null = null;

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!client) {
    client = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return client;
}

export function isReviewsEnabled() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Studio owner can reply to reviews when signed in with this email. */
export function isReviewAdmin(user: User | null | undefined) {
  const email = user?.email?.trim().toLowerCase();
  if (!email) return false;
  return email === site.notifyEmail.toLowerCase();
}

export type { User };
