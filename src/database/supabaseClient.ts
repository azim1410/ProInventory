import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hlqktyywhwcgojgdbzza.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhscWt0eXl3aHdjZ29qZ2RienphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxOTk2MzYsImV4cCI6MjA1MDc3NTYzNn0.s1CBly9g8ZhgofbnMmOgyV9yV0Xj-ZSX2cakLVoPLyI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);