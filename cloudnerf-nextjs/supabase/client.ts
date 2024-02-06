import { assertValue } from "@/utils";
import { createClient } from "@supabase/supabase-js";

export const supabaseClient = createClient(
	assertValue(process.env.SUPABASE_PUBLIC_URL),
	assertValue(process.env.ANON_KEY),
);

export const supabaseServiceClient = createClient(
	assertValue(process.env.SUPABASE_PUBLIC_URL),
	assertValue(process.env.SERVICE_ROLE_KEY),
)
