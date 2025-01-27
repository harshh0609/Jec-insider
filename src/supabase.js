import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://ukfbmhyldiafajalwcbz.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZmJtaHlsZGlhZmFqYWx3Y2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc5OTQzNjQsImV4cCI6MjA1MzU3MDM2NH0.h7tQfSwhFQ1AaJclp3b1tsWKEPPZvtWLMb50jVtukeM"
const supabase = createClient(supabaseUrl, supabaseKey)
export default supabase;
