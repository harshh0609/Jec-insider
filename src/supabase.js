import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nkvictbugbscfagazmnw.supabase.co";
const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rdmljdGJ1Z2JzY2ZhZ2F6bW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NTIwOTksImV4cCI6MjA1MDUyODA5OX0.t1rZznUyhCQ-HJmJeuqP-ZGKOpqWx8rwkazKSzzFwmI";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
