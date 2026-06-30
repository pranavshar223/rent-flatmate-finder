const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase URL or Anon Key is missing. Auth features may not work.');
}

const supabase = createClient(
  env.SUPABASE_URL || 'https://placeholder.supabase.co',
  env.SUPABASE_ANON_KEY || 'placeholder_key'
);

module.exports = supabase;
