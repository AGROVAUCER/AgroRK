// src/lib/supabaseAdmin.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
if (!supabaseUrl) throw new Error("SUPABASE_URL missing");

const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!rawKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY missing");

// Render/CI zna da ubaci newline ili da se zalepi sledeca varijabla.
// Uzmi samo prvu liniju i trim.
const serviceKey = rawKey.split("\n")[0].trim();

// Dodatno: ako je neko nalepio "JWT_SECRET=" u istu vrednost, preseci pre toga.
const cleanKey = serviceKey.split("JWT_SECRET=")[0].trim();

export const supabaseAdmin = createClient(supabaseUrl, cleanKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});