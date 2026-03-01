import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    // Use bracket notation to prevent Turbopack from inlining at build time
    const env = process.env;
    const url = env['SUPABASE_URL'];
    const key = env['SUPABASE_ANON_KEY'];
    if (!url || !key) {
      throw new Error('Supabase env vars not configured');
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}
