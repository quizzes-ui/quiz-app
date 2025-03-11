import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = 'https://ngzymmnykflzgqkxbbfr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5nenltbW55a2Zsemdxa3hiYmZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjQyOTcsImV4cCI6MjA1NzMwMDI5N30.TUDLMBs7SRBdBssSFAhkEXAc2l2BIBCni3_O4_UKbN8';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;