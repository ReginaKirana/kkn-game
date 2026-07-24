import { createClient } from '@supabase/supabase-js';

// TODO: Replace these with your actual Supabase project URL and Anon Key
// You can get them from the Supabase Dashboard -> Settings -> API
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nrxtfafgfqowizvzwwaq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_8Sfo3_pP8XcN9ry6hr1WVQ_n9n2cz7O';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
