import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// ✅ Load Supabase credentials from environment variables
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export { supabase };
