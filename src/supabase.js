import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ptudedipvmhuniqbnhop.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB0dWRlZGlwdm1odW5pcWJuaG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxNzc3MTcsImV4cCI6MjA4Nzc1MzcxN30.VYURk_ZhjBIUbv3Umyb3QoAyO_pM1oXQItyHMzxPbj0";

export const supabase = createClient(supabaseUrl, supabaseKey);