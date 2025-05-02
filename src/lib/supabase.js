// supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tsuqfkpaifkzevirqzqv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzdXFma3BhaWZremV2aXJxenF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTczNzMsImV4cCI6MjA2MTE3MzM3M30.YvmRgsjhmgzjIwqlsjsjGz26rXxStn0ZOrSKzKPTVS4'

export const supabase = createClient(supabaseUrl, supabaseKey)
