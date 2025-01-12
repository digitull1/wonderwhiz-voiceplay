import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tyyucvvapqwzjkqcgjwb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXVjdnZhcHF3emprcWNnandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUwMjQzMzcsImV4cCI6MjAyMDYwMDMzN30.qDPDUPKcpVGBZ8QkGwmAcS5h8zXvdPQkm_IrwXtfBvY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true // Enable debug logs to help identify auth issues
  },
  global: {
    headers: {
      'x-client-info': 'wonderwhiz-web'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add error event listener to help debug connection issues
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (event === 'SIGNED_OUT') {
    console.log('User signed out');
  } else if (event === 'SIGNED_IN') {
    console.log('User signed in:', session?.user?.id);
  } else if (event === 'USER_DELETED') {
    console.log('User deleted');
  } else if (event === 'USER_UPDATED') {
    console.log('User updated');
  }
});