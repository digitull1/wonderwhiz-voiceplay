import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyyucvvapqwzjkqcgjwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXVjdnZhcHF3emprcWNnandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQzMzcsImV4cCI6MjAyMDYwMDMzN30.qDPDUPKcpVGBZ8QkGwmAcS5h8zXvdPQkm_IrwXtfBvY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    storage: window.localStorage,
    storageKey: 'sb-tyyucvvapqwzjkqcgjwb-auth-token'
  },
  global: {
    headers: {
      'x-client-info': 'wonderwhiz-web'
    }
  }
});

// Add auth state change listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'USER_UPDATED') {
    console.log('User updated');
  }
});

// Add error event listener to help debug connection issues
supabase.auth.getSession().then(({ data: { session }, error }) => {
  if (error) {
    console.error('Error getting session:', error);
  } else if (session) {
    console.log('Initial session:', session);
  } else {
    console.log('No active session');
  }
});