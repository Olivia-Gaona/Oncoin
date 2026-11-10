import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'sb_publishable_sQuDHCfaS3WRV6rknozy0w_B6ijE0q4'
const supabaseAnonKey = 'sb_secret_olpyH4TwlNZhlrIrqPMSFw_6vXLJ8ex'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)