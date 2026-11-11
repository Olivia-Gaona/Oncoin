import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://eddunzxqlvfwjukulvfb.supabase.co/rest/v1/'
const supabaseAnonKey = 'sb_publishable_sQuDHCfaS3WRV6rknozy0w_B6ijE0q4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)