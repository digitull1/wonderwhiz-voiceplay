import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

const supabaseUrl = 'https://tyyucvvapqwzjkqcgjwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXVjdnZhcHF3emprcWNnandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4OTY5MTgsImV4cCI6MjAyMjQ3MjkxOH0.GG5UQiJcJjAQvPV8Qz-cXHZt_qBKHy9sxOPL2UyNK2Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  debug: true
});

// Listen to auth state changes for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  console.log('Session:', session);
});

// Validate session on initialization
(async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
  } else if (session) {
    console.log('Initial session:', session);
  }
})();