/*
 * Supabase clients — lazy singletons.
 *
 * Two clients:
 *
 *   getSupabase()      — anon key, respects RLS. Safe for public reads.
 *   getSupabaseAdmin() — service role key, bypasses RLS. SERVER-SIDE ONLY.
 *                        Never expose SUPABASE_SERVICE_ROLE_KEY to the client.
 *
 * Environment variables (add to .env.local):
 *
 *   NEXT_PUBLIC_SUPABASE_URL       — Project API URL (exposed to browser — safe)
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY  — Anon/public key  (exposed to browser — safe with RLS)
 *   SUPABASE_SERVICE_ROLE_KEY      — Service role key (server-only — never NEXT_PUBLIC_)
 *
 * All three are in: Supabase dashboard → Project → Settings → API
 *
 * All clients are created lazily so the module loads cleanly at build time
 * even when env vars aren't set yet.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// ─── Anon client (public reads, RLS enforced) ─────────────────────────────────

let _anonClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_anonClient) return _anonClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  _anonClient = createClient(url, key);
  return _anonClient;
}

// ─── Admin client (service role, bypasses RLS — server-side only) ─────────────

let _adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (_adminClient) return _adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  _adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _adminClient;
}

// ─── Config flag ──────────────────────────────────────────────────────────────

export const isSupabaseConfigured =
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

// ─── Typed row ────────────────────────────────────────────────────────────────

export type PresetRow = {
  id: string;
  user_email: string;
  tool: string;
  name: string;
  state: unknown;
  is_public: boolean;
  created_at: string;
};
