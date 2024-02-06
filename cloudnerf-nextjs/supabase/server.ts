import { assertValue } from "@/utils";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const cookieStore = cookies();

export const supabaseServerClient = createServerClient(
	assertValue(process.env.SUPABASE_PUBLIC_URL),
	assertValue(process.env.SERVICE_ROLE_KEY),
	{
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value;
			},
			set(name: string, value: string, options: CookieOptions) {
				cookieStore.set({ name, value, ...options });
			},
			remove(name: string, options: CookieOptions) {
				cookieStore.set({ name, value: "", ...options });
			},
		},
	},
);
