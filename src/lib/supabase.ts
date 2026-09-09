/**
 * Zero-dependency Supabase REST Client
 * Directly talks to Supabase PostgREST v1 endpoints without requiring extra npm packages.
 */

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

interface FetchOptions {
  select?: string;
  order?: string;
  limit?: number;
  eq?: Record<string, string | number | boolean>;
}

export async function fetchFromSupabase<T = any>(
  table: string, 
  options: FetchOptions = {}
): Promise<{ data: T[] | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase URL or Anon Key not configured in environment.' };
  }

  try {
    const params = new URLSearchParams();
    if (options.select) params.append('select', options.select);
    if (options.order) params.append('order', options.order);
    if (options.limit) params.append('limit', options.limit.toString());
    
    if (options.eq) {
      Object.entries(options.eq).forEach(([k, v]) => {
        params.append(k, `eq.${v}`);
      });
    }

    const queryStr = params.toString();
    const url = `${supabaseUrl}/rest/v1/${table}${queryStr ? `?${queryStr}` : ''}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `Supabase Error (${res.status}): ${errText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Network request to Supabase failed' };
  }
}

export async function insertIntoSupabase<T = any>(
  table: string, 
  payload: any
): Promise<{ data: T | null; error: string | null }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: 'Supabase credentials not configured.' };
  }

  try {
    const url = `${supabaseUrl}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { data: null, error: `Supabase Insert Error (${res.status}): ${errText}` };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err?.message || 'Network insert to Supabase failed' };
  }
}
