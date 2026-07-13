// =====================================
// SkillForge Academy Supabase Connection
// =====================================

// Replace with YOUR Project URL
const SUPABASE_URL = "https://ijozefzytkdyqxquapmh.supabase.co";

// Replace with YOUR Publishable Key
const SUPABASE_ANON_KEY = "sb_publishable_2D1GjwEj1YTCcwv_0Rn_uA_EZya8pYo";

// Create client
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Make available everywhere
window.supabaseClient = supabase;

console.log("✅ Connected to Supabase");
const supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
    );
