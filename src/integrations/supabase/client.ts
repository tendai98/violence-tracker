// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ornxzflifhobvtgegfnv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ybnh6ZmxpZmhvYnZ0Z2VnZm52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2NjEyNDMsImV4cCI6MjA1ODIzNzI0M30.C8I_98ez8hJ4snk5jMXEsk1thKcEW8z9VMtz4ts8f90";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);