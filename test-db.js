import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase credentials missing in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log("Testing Supabase connection...");
  try {
    const { data, error } = await supabase.from('notes').select('*').limit(1);
    if (error) {
      console.error("Error querying Supabase:", error.message);
      return;
    }
    console.log("Connection successful! Retrieved data from 'notes' table:", data);
  } catch (err) {
    console.error("Exception during connection:", err);
  }
}

testConnection();
