const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');

// env.js already validates that these exist, so we can safely initialize
const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);

module.exports = supabase;
