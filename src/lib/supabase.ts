
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://hearjlibntcenblbanzz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhlYXJqbGlibnRjZW5ibGJhbnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwOTkzMzIsImV4cCI6MjA1NjY3NTMzMn0.fyTGMrzKOk1Dh49Fw6RJFnhaokZ-syniuabONa1GkdE';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
