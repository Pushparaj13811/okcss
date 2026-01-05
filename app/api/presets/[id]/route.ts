/*
 * PATCH  /api/presets/[id]  — update is_public flag
 * DELETE /api/presets/[id]  — delete a preset
 *
 * Both require an active session. Row is filtered by user_email so users
 * can only modify/delete their own presets.
 * Returns 503 if Supabase is not configured.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { Session } from 'next-auth';
import { auth } from '@/auth';
import { getSupabaseAdmin } from '@/src/lib/supabase';

type Params = { params: Promise<{ id: string }> };

async function getEmail(): Promise<string | null> {
  const session = (await auth()) as Session | null;
  return session?.user?.email ?? null;
}

// ─── PATCH ────────────────────────────────────────────────────────────────────

export async function PATCH(req: NextRequest, { params }: Params) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;
  let body: { isPublic?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (typeof body.isPublic !== 'boolean') {
    return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
  }

  let supabase;
  try { supabase = getSupabaseAdmin(); } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { data, error } = await supabase
    .from('presets')
    .update({ is_public: body.isPublic })
    .eq('id', id)
    .eq('user_email', email)
    .select('id, tool, name, state, is_public, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json(data);
}

// ─── DELETE ───────────────────────────────────────────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const email = await getEmail();
  if (!email) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 });

  const { id } = await params;

  let supabase;
  try { supabase = getSupabaseAdmin(); } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const { error } = await supabase
    .from('presets')
    .delete()
    .eq('id', id)
    .eq('user_email', email);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return new NextResponse(null, { status: 204 });
}
