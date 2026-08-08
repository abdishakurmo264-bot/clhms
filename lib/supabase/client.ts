import { createClient } from "@supabase/supabase-js";
import { Database } from "@/types/supabase";

// Browser-side Supabase Client with Realtime Subscription enabled
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kwognmwltcvyjtdsydnx.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3b2dubXdsdGN2eWp0ZHN5ZG54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxNDU4ODAsImV4cCI6MjEwMTcyMTg4MH0.snCdqTZhST_eHqAfZ9pEpJHB3sM7dsK_KEnubvdoS84";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
