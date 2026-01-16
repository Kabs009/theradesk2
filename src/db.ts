/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(URL, KEY);

export const SCHEMA_SQL = '';
