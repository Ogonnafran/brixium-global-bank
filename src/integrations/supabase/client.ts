// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://mvsxedheaxxefwnstzbu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12c3hlZGhlYXh4ZWZ3bnN0emJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNDIzOTYsImV4cCI6MjA2NDYxODM5Nn0.StxrCntkHP1gI29wnG8dTdOK64-5YJsnHNSbWTJzLvE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);