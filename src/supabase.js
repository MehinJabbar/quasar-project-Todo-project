import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://wrdgfwttajpeuqjnqjdh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndyZGdmd3R0YWpwZXVxam5xamRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyODE1MDUsImV4cCI6MjA2ODg1NzUwNX0.89VKqxdmWSSie7vmqZd9P3u_TDD5IXw2FkYfM5AQz6Y";
const supabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabaseClient;
