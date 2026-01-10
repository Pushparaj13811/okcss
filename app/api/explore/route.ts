/*
 * GET /api/explore?tool=shadow&limit=20&offset=0
 *
 * Returns public presets — no auth required.
 * Supports optional tool filter and basic pagination.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/src/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const tool   = searchParams.get('tool');
  const limit  = Math.min(parseInt(searchParams.get('limit')  ?? '24', 10), 50);
  const offset = Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0);

  let supabase;
  try { supabase = getSupabaseAdmin(); } catch {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  let query = supabase
    .from('presets')
    .select('id, tool, name, state, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (tool) query = query.eq('tool', tool);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}
