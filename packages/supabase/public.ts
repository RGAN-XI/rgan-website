import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Cookie-free Supabase client for public, read-mostly data on the public
 * website.
 *
 * `@gad/supabase/server` reads `cookies()`, which opts every page that calls
 * it into dynamic rendering (no static HTML, no ISR, no CDN caching). The
 * public site never needs an auth session, so this client skips cookies
 * entirely and lets pages be statically rendered and revalidated in the
 * background.
 *
 * GET requests are cached by the Next.js data cache and revalidated every
 * `REVALIDATE_SECONDS`. Anything else (RPC calls that write, such as view and
 * download counters) is never cached.
 */
export const REVALIDATE_SECONDS = 60;

export function createClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: (input, init) => {
          const method = (init?.method ?? "GET").toUpperCase();
          const isRead = method === "GET" || method === "HEAD";

          return fetch(
            input,
            isRead
              ? { ...init, next: { revalidate: REVALIDATE_SECONDS } }
              : { ...init, cache: "no-store" },
          );
        },
      },
    },
  );
}

export type { Database };
