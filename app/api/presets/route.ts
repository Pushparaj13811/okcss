/*
 * GET  /api/presets?tool=shadow  — list signed-in user's presets for a tool
 * POST /api/presets              — create a new preset
 *
 * Both routes require an active session. Returns 401 if unauthenticated.
 * Returns 503 if Supabase is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/src/lib/supabase';

async function getEmail(): Promise<string | null> {
  const session = (await auth()) as Session | null;
  return session?.user?.email ?? null;
}

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  let supabase;
  try { supabase = getSupabaseAdmin(); } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const tool = req.nextUrl.searchParams.get('tool');

  let query = supabase
    .from('presets')
    .select('id, tool, name, state, is_public, created_at')
    .eq('user_email', email)
    .order('created_at', { ascending: false });

  if (tool) query = query.eq('tool', tool);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  let body: { tool?: string; name?: string; state?: unknown; isPublic?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { tool, name, state, isPublic = false } = body;

  if (!tool || typeof tool !== 'string') {
    return NextResponse.json({ error: 'Missing tool' }, { status: 400 });
  }
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return NextResponse.json({ error: 'Missing name' }, { status: 400 });
  }
  if (name.trim().length > 60) {
    return NextResponse.json({ error: 'Name too long (max 60)' }, { status: 400 });
  }
  if (state === undefined) {
    return NextResponse.json({ error: 'Missing state' }, { status: 400 });
  }

  let supabase;
  try { supabase = getSupabaseAdmin(); } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('presets')
    .insert({ user_email: email, tool, name: name.trim(), state, is_public: isPublic })
    .select('id, tool, name, state, is_public, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data, { status: 201 });
}
