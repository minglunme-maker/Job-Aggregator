import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Only create Supabase client if we have valid credentials (not demo mode)
const isDemo = !supabaseUrl || supabaseUrl === 'demo' || !supabaseUrl.startsWith('http');

export const supabase = isDemo
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

// For server-side operations that need elevated privileges
export const getServiceSupabase = () => {
  // In demo mode, return a mock client
  if (isDemo) {
    console.log('📝 Demo mode: Supabase client is disabled');
    return null as any; // Return null but typed to avoid TypeScript errors
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not defined');
  }
  return createClient(supabaseUrl, serviceRoleKey);
};
