/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Use valid fallback values to prevent initialization errors
// The app will still work in demo mode even without real Supabase credentials
const URL = import.meta.env.VITE_SUPABASE_URL || 'https://example.supabase.co';
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.fake-key-for-demo';

export const supabase = createClient(URL, KEY);

export const SCHEMA_SQL = '';
