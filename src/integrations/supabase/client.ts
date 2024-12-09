import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://tyyucvvapqwzjkqcgjwb.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5eXVjdnZhcHF3emprcWNnandiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTU3MDQsImV4cCI6MjA0OTA3MTcwNH0.lqkWqGw-XBMDogEziPeGo6xViURec5i5xTxp8pu8ooo";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});