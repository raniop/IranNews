import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _supabase: SupabaseClient | null = null;
let _initFailed = false;

export function getSupabase(): SupabaseClient | null {
  if (_initFailed) return null;
  if (_supabase) return _supabase;

  try {
    const url = String(process.env.SUPABASE_URL || '');
    const key = String(process.env.SUPABASE_ANON_KEY || '');
    if (!url || !key) {
      console.warn('Supabase env vars not set, analytics will use in-memory only');
      _initFailed = true;
      return null;
    }
    _supabase = createClient(url, key);
    return _supabase;
  } catch (e) {
    console.warn('Failed to initialize Supabase:', e);
    _initFailed = true;
    return null;
  }
}
