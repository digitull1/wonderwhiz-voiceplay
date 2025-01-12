import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://tyyucvvapqwzjkqcgjwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXVjdnZhcHF3emprcWNnandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTY5MTgsImV4cCI6MjAyMjQ3MjkxOH0.GG5UQiJcJjAQvPV8Qz-cXHZt_qBKHy9sxOPL2UyNK2Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'sb-tyyucvvapqwzjkqcgjwb-auth-token',
    flowType: 'pkce',
  },
  global: {
    headers: {
      'X-Client-Info': 'wonderwhiz-app',
    },
  },
});

// Add better error logging for debugging auth issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (session) {
    console.log('Session user:', session.user.id);
  } else {
    console.log('No active session');
  }
});

// Validate session on initialization
(async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
    } else if (session) {
      console.log('Initial session:', session.user.id);
    } else {
      console.log('No initial session found');
    }
  } catch (err) {
    console.error('Error initializing Supabase client:', err);
  }
})();